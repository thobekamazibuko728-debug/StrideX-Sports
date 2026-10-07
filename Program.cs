

using Microsoft.AspNetCore.Identity;

using Microsoft.EntityFrameworkCore;

using StrideX.Api.Data;

using StrideX.Api.Models;



var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls(

    $"http://0.0.0.0:{Environment.GetEnvironmentVariable("PORT") ?? "5103"}"

);



// STRIDEX SERVICES



builder.Services.AddOpenApi();



// Allow the StrideX website to communicate with the C# API.

builder.Services.AddCors(options =>

{

    options.AddPolicy("StrideXWebsite", policy =>

    {

        policy

            .WithOrigins(

                "http://127.0.0.1:5500",

                "http://localhost:5500"

            )

            .AllowAnyHeader()

            .AllowAnyMethod()

            .AllowCredentials();

    });

});



// STRIDEX MYSQL CONNECTION



var mysqlSettings =

    new MySqlConnector.MySqlConnectionStringBuilder

    {

        Server = builder.Configuration["MySql:Server"] ?? "localhost",



        Port = uint.TryParse(

            builder.Configuration["MySql:Port"],

            out var mysqlPort

        ) ? mysqlPort : 3306u,



        Database = builder.Configuration["MySql:Database"]

                   ?? "stridex_db",



        UserID = builder.Configuration["MySql:User"]

                 ?? "stridex_app",



        Password = builder.Configuration["MySql:Password"]

    };



builder.Services.AddDbContext<StrideXDbContext>(options =>

    options.UseMySql(

        mysqlSettings.ConnectionString,

        new MySqlServerVersion(new Version(8, 4, 11))

    )

);



// STRIDEX USER ACCOUNTS



builder.Services

    .AddIdentity<ApplicationUser, IdentityRole>(options =>

    {

        // A customer must register with a unique email address.

        options.User.RequireUniqueEmail = true;



        // Password rules for StrideX accounts.

        options.Password.RequiredLength = 8;

        options.Password.RequireDigit = true;

        options.Password.RequireUppercase = false;

        options.Password.RequireLowercase = false;

        options.Password.RequireNonAlphanumeric = false;



        // Email confirmation can be added when we implement email.

        options.SignIn.RequireConfirmedAccount = false;



        // Temporarily lock an account after repeated failed logins.

        options.Lockout.DefaultLockoutTimeSpan =

            TimeSpan.FromMinutes(15);



        options.Lockout.MaxFailedAccessAttempts = 5;

        options.Lockout.AllowedForNewUsers = true;

    })

    .AddEntityFrameworkStores<StrideXDbContext>()

    .AddDefaultTokenProviders();



builder.Services.ConfigureApplicationCookie(options =>

{

    options.Cookie.Name = "StrideX.Auth";

    options.Cookie.HttpOnly = true;

    options.Cookie.SameSite = SameSiteMode.Lax;



    // Local development currently uses HTTP.

    // A deployed website must use HTTPS.

    options.Cookie.SecurePolicy =

        builder.Environment.IsDevelopment()

            ? CookieSecurePolicy.SameAsRequest

            : CookieSecurePolicy.Always;



    options.ExpireTimeSpan = TimeSpan.FromHours(8);

    options.SlidingExpiration = true;



    // APIs must return status codes, not redirect to an HTML login page.

    options.Events.OnRedirectToLogin = context =>

    {

        context.Response.StatusCode =

            StatusCodes.Status401Unauthorized;



        return Task.CompletedTask;

    };



    options.Events.OnRedirectToAccessDenied = context =>

    {

        context.Response.StatusCode =

            StatusCodes.Status403Forbidden;



        return Task.CompletedTask;

    };

});



builder.Services.AddAuthorization();



var app = builder.Build();

// =====================================

// APPLY DATABASE MIGRATIONS

// =====================================



using (var scope = app.Services.CreateScope())

{

    var db =

        scope.ServiceProvider

            .GetRequiredService<StrideXDbContext>();



    await db.Database.MigrateAsync();

}



// HTTP PIPELINE



if (app.Environment.IsDevelopment())

{

    app.MapOpenApi();

}





// Serve the StrideX frontend from wwwroot.



var staticFileProvider =

    new Microsoft.AspNetCore.StaticFiles

        .FileExtensionContentTypeProvider();



staticFileProvider.Mappings[".xhtml"] =

    "text/html";



app.UseDefaultFiles();



app.UseStaticFiles(

    new StaticFileOptions

    {

        ContentTypeProvider =

            staticFileProvider

    }

);





app.UseCors("StrideXWebsite");



app.UseAuthentication();

app.UseAuthorization();



// EXISTING WEATHER ENDPOINT



var summaries = new[]

{

    "Freezing", "Bracing", "Chilly", "Cool", "Mild",

    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"

};



app.MapGet("/weatherforecast", () =>

{

    var forecast = Enumerable.Range(1, 5)

        .Select(index =>

            new WeatherForecast(

                DateOnly.FromDateTime(

                    DateTime.Now.AddDays(index)

                ),

                Random.Shared.Next(-20, 55),

                summaries[

                    Random.Shared.Next(summaries.Length)

                ]

            )

        )

        .ToArray();



    return forecast;

})

.WithName("GetWeatherForecast");



// EXISTING DATABASE CONNECTION TEST



if (app.Environment.IsDevelopment())

{

    app.MapGet("/api/database-test", async (

        IConfiguration config) =>

    {

        var password = config["MySql:Password"];



        if (string.IsNullOrWhiteSpace(password))

        {

            return Results.Problem(

                "MySQL password is not configured.",

                statusCode: 503

            );

        }



        var connectionSettings =

            new MySqlConnector.MySqlConnectionStringBuilder

            {

                Server = config["MySql:Server"] ?? "localhost",



                Port = uint.TryParse(

                    config["MySql:Port"],

                    out var port

                ) ? port : 3306u,



                Database = config["MySql:Database"]

                           ?? "stridex_db",



                UserID = config["MySql:User"]

                         ?? "stridex_app",



                Password = password

            };



        try

        {

            await using var connection =

                new MySqlConnector.MySqlConnection(

                    connectionSettings.ConnectionString

                );



            await connection.OpenAsync();



            await using var command =

                connection.CreateCommand();



            command.CommandText = "SELECT DATABASE();";



            var database =

                await command.ExecuteScalarAsync();



            return Results.Ok(new

            {

                status = "connected",

                database

            });

        }

        catch (MySqlConnector.MySqlException error)

        {

            return Results.Problem(

                "MySQL error number: " + error.Number,

                statusCode: 503

            );

        }

    });

}



// EXISTING SPORTS API



app.MapGet("/api/sports", async (IConfiguration config) =>

{

    var settings =

        new MySqlConnector.MySqlConnectionStringBuilder

        {

            Server = config["MySql:Server"] ?? "localhost",



            Database = config["MySql:Database"]

                       ?? "stridex_db",



            UserID = config["MySql:User"]

                     ?? "stridex_app",



            Password = config["MySql:Password"],



            Port = uint.TryParse(

                config["MySql:Port"],

                out var port

            ) ? port : 3306u

        };



    var sports = new List<object>();



    try

    {

        await using var connection =

            new MySqlConnector.MySqlConnection(

                settings.ConnectionString

            );



        await connection.OpenAsync();



        await using var command =

            connection.CreateCommand();



        command.CommandText =

            "SELECT SportID, SportName FROM Sports ORDER BY SportID;";



        await using var reader =

            await command.ExecuteReaderAsync();



        while (await reader.ReadAsync())

        {

            sports.Add(new

            {

                sportID = reader.GetInt32(0),

                sportName = reader.GetString(1)

            });

        }



        return Results.Ok(sports);

    }

    catch (MySqlConnector.MySqlException error)

    {

        return Results.Problem(

            "Database error number: " + error.Number,

            statusCode: 503

        );

    }

});



// =====================================

// STRIDEX REGISTER

// =====================================



app.MapPost("/api/auth/register", async (

    RegisterRequest request,

    UserManager<ApplicationUser> userManager,

    SignInManager<ApplicationUser> signInManager) =>

{

    if (string.IsNullOrWhiteSpace(request.FullName) ||

        string.IsNullOrWhiteSpace(request.Email) ||

        string.IsNullOrWhiteSpace(request.Password))

    {

        return Results.BadRequest(new

        {

            message = "Full name, email and password are required."

        });

    }



    var fullName = request.FullName.Trim();

    var email = request.Email.Trim();



    if (fullName.Length > 100)

    {

        return Results.BadRequest(new

        {

            message = "Full name must be 100 characters or fewer."

        });

    }



    var user = new ApplicationUser

    {

        FullName = fullName,

        UserName = email,

        Email = email,

        CreatedAt = DateTime.UtcNow

    };



    // Identity hashes the password before saving the user.

    var result =

        await userManager.CreateAsync(user, request.Password);



    if (!result.Succeeded)

    {

        return Results.ValidationProblem(

            new Dictionary<string, string[]>

            {

                ["account"] = result.Errors

                    .Select(error => error.Description)

                    .ToArray()

            }

        );

    }



    // Log the customer in after successful registration.

    await signInManager.SignInAsync(

        user,

        isPersistent: false

    );



    return Results.Ok(new

    {

        message = "StrideX account created successfully.",

        user = new

        {

            user.Id,

            user.FullName,

            user.Email

        }

    });

});



// =====================================

// STRIDEX LOGIN

// =====================================



app.MapPost("/api/auth/login", async (

    LoginRequest request,

    UserManager<ApplicationUser> userManager,

    SignInManager<ApplicationUser> signInManager) =>

{

    if (string.IsNullOrWhiteSpace(request.Email) ||

        string.IsNullOrWhiteSpace(request.Password))

    {

        return Results.BadRequest(new

        {

            message = "Email and password are required."

        });

    }



    var email = request.Email.Trim();



    var user =

        await userManager.FindByEmailAsync(email);



    if (user is null)

    {

        return Results.Unauthorized();

    }



    var result =

        await signInManager.PasswordSignInAsync(

            user,

            request.Password,

            isPersistent: false,

            lockoutOnFailure: true

        );



    if (result.IsLockedOut)

    {

        return Results.Problem(

            "Too many failed login attempts. Please try again later.",

            statusCode: 429

        );

    }



    if (!result.Succeeded)

    {

        return Results.Unauthorized();

    }



    return Results.Ok(new

    {

        message = "Logged in successfully.",

        user = new

        {

            user.Id,

            user.FullName,

            user.Email

        }

    });

});



// =====================================

// STRIDEX MY ACCOUNT

// =====================================



app.MapGet("/api/auth/me", async (

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager) =>

{

    var user =

        await userManager.GetUserAsync(httpContext.User);



    if (user is null)

    {

        return Results.Unauthorized();

    }



    return Results.Ok(new

    {

        user.Id,

        user.FullName,

        user.Email,

        user.CreatedAt

    });

})

.RequireAuthorization();



// =====================================

// STRIDEX LOGOUT

// =====================================



app.MapPost("/api/auth/logout", async (

    SignInManager<ApplicationUser> signInManager) =>

{

    await signInManager.SignOutAsync();



    return Results.Ok(new

    {
        message = "Logged out successfully."

    });

});

// =====================================

// STRIDEX CHANGE PASSWORD

// =====================================



app.MapPost("/api/auth/change-password", async (

    ChangePasswordRequest request,

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager) =>

{

    var user =

        await userManager.GetUserAsync(

            httpContext.User

        );



    if (user is null)

    {

        return Results.Unauthorized();

    }



    if (string.IsNullOrWhiteSpace(request.CurrentPassword) ||

        string.IsNullOrWhiteSpace(request.NewPassword))

    {

        return Results.BadRequest(new

        {

            message =

                "Current password and new password are required."

        });

    }



    if (request.NewPassword.Length < 8)

    {

        return Results.BadRequest(new

        {

            message =

                "New password must be at least 8 characters."

        });

    }



    var result =

        await userManager.ChangePasswordAsync(

            user,

            request.CurrentPassword,

            request.NewPassword

        );



    if (!result.Succeeded)

    {

        return Results.ValidationProblem(

            new Dictionary<string, string[]>

            {

                ["password"] =

                    result.Errors

                        .Select(

                            error =>

                                error.Description

                        )

                        .ToArray()

            }

        );

    }



    return Results.Ok(new

    {

        message =

            "Password changed successfully."

    });

})

.RequireAuthorization();

// =====================================

// STRIDEX UPDATE ACCOUNT

// =====================================



app.MapPut("/api/auth/account", async (

    UpdateAccountRequest request,

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager) =>

{

    var user =

        await userManager.GetUserAsync(

            httpContext.User

        );



    if (user is null)

    {

        return Results.Unauthorized();

    }





    if (

        string.IsNullOrWhiteSpace(

            request.FullName

        ) ||

        string.IsNullOrWhiteSpace(

            request.Email

        )

    )

    {

        return Results.BadRequest(new

        {

            message =

                "Full name and email address are required."

        });

    }





    var fullName =

        request.FullName.Trim();



    var email =

        request.Email.Trim();





    if (fullName.Length > 100)

    {

        return Results.BadRequest(new

        {

            message =

                "Full name must be 100 characters or fewer."

        });

    }





    var existingUser =

        await userManager.FindByEmailAsync(

            email

        );



    if (

        existingUser is not null &&

        existingUser.Id != user.Id

    )

    {

        return Results.BadRequest(new

        {

            message =

                "That email address is already in use."

        });

    }





    user.FullName =

        fullName;



    user.Email =

        email;



    user.UserName =

        email;





    var result =

        await userManager.UpdateAsync(

            user

        );





    if (!result.Succeeded)

    {

        return Results.ValidationProblem(

            new Dictionary<string, string[]>

            {

                ["account"] =

                    result.Errors

                        .Select(

                            error =>

                                error.Description

                        )

                        .ToArray()

            }

        );

    }





    return Results.Ok(new

    {

        message =

            "Account information updated successfully.",



        user = new

        {

            user.Id,

            user.FullName,

            user.Email

        }

    });

})

.RequireAuthorization();

// =====================================

// STRIDEX DELETE ACCOUNT

// =====================================



app.MapPost("/api/auth/delete-account", async (

    DeleteAccountRequest request,

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager,

    SignInManager<ApplicationUser> signInManager,

    StrideXDbContext db) =>

{

    var user =

        await userManager.GetUserAsync(

            httpContext.User

        );



    if (user is null)

    {

        return Results.Unauthorized();

    }





    if (string.IsNullOrWhiteSpace(

        request.CurrentPassword

    ))

    {

        return Results.BadRequest(new

        {

            message =

                "Enter your current password."

        });

    }





    var passwordCorrect =

        await userManager.CheckPasswordAsync(

            user,

            request.CurrentPassword

        );



    if (!passwordCorrect)

    {

        return Results.BadRequest(new

        {

            message =

                "Your current password is incorrect."

        });

    }





    // Remove the customer's active cart.

    // Cart items are deleted automatically

    // because Cart -> CartItems uses cascade delete.



    var cart =

        await db.Carts

            .FirstOrDefaultAsync(

                c => c.CartToken == user.Id

            );



    if (cart is not null)

    {

        db.Carts.Remove(cart);



        await db.SaveChangesAsync();

    }





    // Delete the customer's Identity account.

    // Existing orders remain in the database

    // as historical transaction records.



    var result =

        await userManager.DeleteAsync(user);



    if (!result.Succeeded)

    {

        return Results.ValidationProblem(

            new Dictionary<string, string[]>

            {

                ["account"] =

                    result.Errors

                        .Select(

                            error =>

                                error.Description

                        )

                        .ToArray()

            }

        );

    }





    await signInManager.SignOutAsync();





    return Results.Ok(new

    {

        message =

            "Your StrideX account has been deleted."

    });

})

.RequireAuthorization();



// =====================================

// STRIDEX — ADD TO CART

// =====================================



app.MapPost("/api/cart/items", async (

    AddCartItemRequest request,

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager,

    StrideXDbContext db) =>

{

    var user =

        await userManager.GetUserAsync(httpContext.User);



    if (user is null)

    {

        return Results.Unauthorized();

    }



    if (string.IsNullOrWhiteSpace(request.ProductId) ||

        string.IsNullOrWhiteSpace(request.SelectedSize) ||

        request.Quantity < 1 ||

        request.Quantity > 99)

    {

        return Results.BadRequest(new

        {

            message = "Choose a product, size and valid quantity."

        });

    }



    var size = request.SelectedSize.Trim();



    if (size.Length > 20)

    {

        return Results.BadRequest(new

        {

            message = "Invalid size."

        });

    }



    // Check the actual MySQL product.

    // We never trust a price supplied by the website.

    var product = await db.Products

        .AsNoTracking()

        .FirstOrDefaultAsync(

            p => p.ProductId == request.ProductId

        );



    if (product is null)

    {

        return Results.NotFound(new

        {

            message = "This product was not found."

        });

    }



    // Use the logged-in customer's Identity ID

    // as their cart token.

    var cart = await db.Carts

        .Include(c => c.Items)

        .SingleOrDefaultAsync(

            c => c.CartToken == user.Id

        );



    if (cart is null)

    {

        cart = new Cart

        {

            CartToken = user.Id,

            CreatedAt = DateTime.UtcNow

        };



        db.Carts.Add(cart);

    }



    var existingItem = cart.Items.FirstOrDefault(

        item =>

            item.ProductId == request.ProductId &&

            item.SelectedSize == size

    );



    if (existingItem is not null)

    {

        if (existingItem.Quantity + request.Quantity > 99)

        {

            return Results.BadRequest(new

            {

                message = "Maximum quantity is 99."

            });

        }



        existingItem.Quantity += request.Quantity;

    }

    else

    {

        cart.Items.Add(new CartItem

        {

            ProductId = product.ProductId,

            SelectedSize = size,

            Quantity = request.Quantity

        });

    }



    cart.UpdatedAt = DateTime.UtcNow;



    await db.SaveChangesAsync();



    return Results.Ok(new

    {

        message = "Product added to cart.",

        productId = product.ProductId,

        name = product.ProductName,

        size,

        price = product.Price

    });

})

.RequireAuthorization();





// =====================================

// STRIDEX — VIEW MY CART

// =====================================



app.MapGet("/api/cart", async (

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager,

    StrideXDbContext db) =>

{

    var user =

        await userManager.GetUserAsync(httpContext.User);



    if (user is null)

    {

        return Results.Unauthorized();

    }



    var items = await db.CartItems

        .AsNoTracking()

        .Where(item => item.Cart.CartToken == user.Id)

        .Join(

            db.Products,

            item => item.ProductId,

            product => product.ProductId,

            (item, product) => new

            {

                cartItemId = item.CartItemId,

                productId = product.ProductId,

                name = product.ProductName,

                image = product.ImagePath,

                size = item.SelectedSize,

                quantity = item.Quantity,

                price = product.Price,

                lineTotal = product.Price * item.Quantity

            }

        )

        .ToListAsync();



    return Results.Ok(new

    {

        items,

        itemCount = items.Sum(item => item.quantity),

        total = items.Sum(item => item.lineTotal)

    });

})

.RequireAuthorization();

// =====================================

// STRIDEX — UPDATE CART QUANTITY

// =====================================



app.MapPut("/api/cart/items/{cartItemId:int}", async (

    int cartItemId,

    UpdateCartItemRequest request,

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager,

    StrideXDbContext db) =>

{

    var user =

        await userManager.GetUserAsync(httpContext.User);



    if (user is null)

    {

        return Results.Unauthorized();

    }



    if (request.Quantity < 1 ||

        request.Quantity > 99)

    {

        return Results.BadRequest(new

        {

            message = "Quantity must be between 1 and 99."

        });

    }



    var item = await db.CartItems

        .Include(i => i.Cart)

        .SingleOrDefaultAsync(i =>

            i.CartItemId == cartItemId &&

            i.Cart.CartToken == user.Id

        );



    if (item is null)

    {

        return Results.NotFound(new

        {

            message = "Cart item not found."

        });

    }


    item.Quantity = request.Quantity;

    item.Cart.UpdatedAt = DateTime.UtcNow;



    await db.SaveChangesAsync();



    return Results.Ok(new

    {

        message = "Cart quantity updated.",

        cartItemId = item.CartItemId,

        quantity = item.Quantity

    });

})

.RequireAuthorization();

// =====================================

// STRIDEX — REMOVE CART ITEM

// =====================================



app.MapDelete("/api/cart/items/{cartItemId:int}", async (

    int cartItemId,

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager,

    StrideXDbContext db) =>

{

    var user =

        await userManager.GetUserAsync(httpContext.User);



    if (user is null)

    {

        return Results.Unauthorized();

    }



    var item = await db.CartItems

        .Include(i => i.Cart)

        .SingleOrDefaultAsync(i =>

            i.CartItemId == cartItemId &&

            i.Cart.CartToken == user.Id

        );



    if (item is null)

    {

        return Results.NotFound(new

        {

            message = "Cart item not found."

        });

    }



    item.Cart.UpdatedAt = DateTime.UtcNow;



    db.CartItems.Remove(item);



    await db.SaveChangesAsync();



    return Results.Ok(new

    {

        message = "Product removed from cart."

    });

})

.RequireAuthorization();

// =====================================

// STRIDEX — PLACE ORDER

// =====================================



app.MapPost("/api/orders/checkout", async (

    CheckoutRequest request,

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager,

    StrideXDbContext db) =>

{

    var user =

        await userManager.GetUserAsync(

            httpContext.User

        );



    if (user is null)

    {

        return Results.Unauthorized();

    }





    // =====================================

    // VALIDATE RECEIPT / DELIVERY DETAILS

    // =====================================



    var customerName =

        request.FullName?.Trim() ?? "";



    var phoneNumber =

        request.PhoneNumber?.Trim() ?? "";



    var streetAddress =

        request.StreetAddress?.Trim() ?? "";



    var city =

        request.City?.Trim() ?? "";



    var province =

        request.Province?.Trim() ?? "";



    var postalCode =

        request.PostalCode?.Trim() ?? "";



    var paymentLast4 =

        new string(

            (request.PaymentLast4 ?? "")

                .Where(char.IsDigit)

                .ToArray()

        );





    if (

        string.IsNullOrWhiteSpace(customerName) ||

        string.IsNullOrWhiteSpace(phoneNumber) ||

        string.IsNullOrWhiteSpace(streetAddress) ||

        string.IsNullOrWhiteSpace(city) ||

        string.IsNullOrWhiteSpace(province) ||

        string.IsNullOrWhiteSpace(postalCode)

    )

    {

        return Results.BadRequest(new

        {

            message =

                "Complete all delivery details before placing your order."

        });

    }





    if (customerName.Length > 100)

    {

        return Results.BadRequest(new

        {

            message =

                "Customer name is too long."

        });

    }





    if (phoneNumber.Length > 20)

    {

        return Results.BadRequest(new

        {

            message =

                "Phone number is too long."

        });

    }





    if (streetAddress.Length > 200)

    {

        return Results.BadRequest(new

        {

            message =

                "Street address is too long."

        });

    }





    if (city.Length > 100)

    {

        return Results.BadRequest(new

        {

            message =

                "City name is too long."

        });

    }





    if (province.Length > 100)

    {

        return Results.BadRequest(new

        {

            message =

                "Province name is too long."

        });

    }





    if (postalCode.Length > 10)

    {

        return Results.BadRequest(new

        {

            message =

                "Postal code is invalid."

        });

    }





    if (paymentLast4.Length != 4)

    {

        return Results.BadRequest(new

        {

            message =

                "Payment information is invalid."

        });

    }





    // =====================================

    // LOAD CUSTOMER CART

    // =====================================



    var cart =

        await db.Carts

            .Include(c => c.Items)

            .SingleOrDefaultAsync(

                c => c.CartToken == user.Id

            );





    if (

        cart is null ||

        cart.Items.Count == 0

    )

    {

        return Results.BadRequest(new

        {

            message = "Your cart is empty."

        });

    }





    // =====================================

    // LOAD REAL PRODUCT INFORMATION

    // =====================================



    var productIds =

        cart.Items

            .Select(

                item => item.ProductId

            )

            .Distinct()

            .ToList();





    var products =

        await db.Products

            .Where(

                product =>

                    productIds.Contains(

                        product.ProductId

                    )

            )

            .ToDictionaryAsync(

                product =>

                    product.ProductId

            );





    foreach (var cartItem in cart.Items)

    {

        if (

            !products.ContainsKey(

                cartItem.ProductId

            )

        )

        {

            return Results.BadRequest(new

            {

                message =

                    "One of the products in your cart is no longer available."

            });

        }

    }





    // =====================================

    // CREATE ORDER

    // =====================================



    await using var transaction =

        await db.Database

            .BeginTransactionAsync();





    try

    {

        var order =

            new Order

            {

                UserId =

                    user.Id,



                OrderDate =

                    DateTime.UtcNow,



                Status =

                    "Confirmed",



                CustomerName =

                    customerName,



                CustomerEmail =

                    user.Email ?? "",



                PhoneNumber =

                    phoneNumber,



                StreetAddress =

                    streetAddress,



                City =

                    city,



                Province =

                    province,



                PostalCode =

                    postalCode,



                PaymentMethod =

                    "Card",



                PaymentLast4 =

                    paymentLast4,



                PaymentStatus =

                    "Paid"

            };





        decimal orderTotal = 0;





        foreach (

            var cartItem in cart.Items

        )

        {

            var product =

                products[

                    cartItem.ProductId

                ];





            var lineTotal =

                product.Price *

                cartItem.Quantity;





            orderTotal +=

                lineTotal;





            order.Items.Add(

                new OrderItem

                {

                    ProductId =

                        product.ProductId,



                    ProductName =

                        product.ProductName,



                    SelectedSize =

                        cartItem.SelectedSize,



                    Quantity =

                        cartItem.Quantity,



                    UnitPrice =

                        product.Price,



                    LineTotal =

                        lineTotal

                }

            );

        }





        order.TotalAmount =

            orderTotal;





        db.Orders.Add(

            order

        );





        // Save first so EF creates OrderId.

        await db.SaveChangesAsync();





        // Checkout clears the customer's cart.

        db.CartItems.RemoveRange(

            cart.Items

        );





        cart.UpdatedAt =

            DateTime.UtcNow;





        await db.SaveChangesAsync();





        await transaction.CommitAsync();





        return Results.Ok(new

        {

            message =

                "Order placed successfully.",



            orderId =

                order.OrderId,



            orderDate =

                order.OrderDate,



            status =

                order.Status,



            total =

                order.TotalAmount,



            itemCount =

                order.Items.Sum(

                    item =>

                        item.Quantity

                )

        });

    }

    catch (Exception ex)

    {

        await transaction.RollbackAsync();



        Console.WriteLine(

            "Checkout failed: " +

            ex.Message

        );



        return Results.Problem(

            detail:

                "The order could not be placed. Please try again.",



            statusCode:

                StatusCodes.Status500InternalServerError

        );

    }

})

.RequireAuthorization();



// =====================================

// STRIDEX — MY ORDERS

// =====================================



app.MapGet("/api/orders", async (

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager,

    StrideXDbContext db) =>

{

    var user =

        await userManager.GetUserAsync(

            httpContext.User

        );



    if (user is null)

    {

        return Results.Unauthorized();

    }





    var orders =

        await db.Orders



            .AsNoTracking()



            .Include(order => order.Items)



            .Where(

                order =>

                    order.UserId == user.Id

            )



            .OrderByDescending(

                order => order.OrderDate

            )



            .ToListAsync();





    var productIds =

        orders

            .SelectMany(

                order => order.Items

            )



            .Select(

                item => item.ProductId

            )



            .Distinct()



            .ToList();





    var productImages =

        await db.Products



            .AsNoTracking()



            .Where(

                product =>
                    productIds.Contains(

                        product.ProductId

                    )

            )



            .ToDictionaryAsync(

                product =>

                    product.ProductId,



                product =>

                    product.ImagePath

            );





    var result =

        orders.Select(

            order => new

            {

                orderId =

                    order.OrderId,



                orderDate =

                    order.OrderDate,



                status =

                    order.Status,



                total =

                    order.TotalAmount,



                itemCount =

                    order.Items.Sum(

                        item =>

                            item.Quantity

                    ),



                items =

                    order.Items.Select(

                        item => new

                        {

                            orderItemId =

                                item.OrderItemId,



                            productId =

                                item.ProductId,



                            name =

                                item.ProductName,



                            size =

                                item.SelectedSize,



                            quantity =

                                item.Quantity,



                            price =

                                item.UnitPrice,



                            lineTotal =

                                item.LineTotal,



                            image =

                                productImages

                                    .TryGetValue(

                                        item.ProductId,

                                        out var imagePath

                                    )

                                        ? imagePath

                                        : ""

                        }

                    )

            }

        );





    return Results.Ok(

        result

    );

})

.RequireAuthorization();

// =====================================

// STRIDEX — ORDER RECEIPT

// =====================================



app.MapGet(

    "/api/orders/{orderId:int}/receipt",

    async (

        int orderId,

        HttpContext httpContext,

        UserManager<ApplicationUser> userManager,

        StrideXDbContext db) =>

{

    var user =

        await userManager.GetUserAsync(

            httpContext.User

        );





    if (user is null)

    {

        return Results.Unauthorized();

    }





    // Only load an order that belongs

    // to the currently logged-in customer.

    var order =

        await db.Orders

            .AsNoTracking()

            .Include(

                order => order.Items

            )

            .SingleOrDefaultAsync(

                order =>

                    order.OrderId == orderId &&

                    order.UserId == user.Id

            );





    if (order is null)

    {

        return Results.NotFound(new

        {

            message =

                "Receipt not found."

        });

    }





    // Load current product images for

    // the items shown on the receipt.

    var productIds =

        order.Items

            .Select(

                item => item.ProductId

            )

            .Distinct()

            .ToList();





    var productImages =

        await db.Products

            .AsNoTracking()

            .Where(

                product =>

                    productIds.Contains(

                        product.ProductId

                    )

            )

            .ToDictionaryAsync(

                product =>

                    product.ProductId,



                product =>

                    product.ImagePath

            );





    var result = new

    {

        receiptNumber =

            "SXR-" +

            order.OrderId

                .ToString()

                .PadLeft(

                    6,

                    '0'

                ),



        orderId =

            order.OrderId,



        orderDate =

            order.OrderDate,



        status =

            order.Status,



        customer = new

        {

            name =

                order.CustomerName,



            email =

                order.CustomerEmail,



            phone =

                order.PhoneNumber

        },



        delivery = new

        {

            streetAddress =

                order.StreetAddress,



            city =

                order.City,



            province =

                order.Province,



            postalCode =

                order.PostalCode

        },



        payment = new

        {

            method =

                order.PaymentMethod,



            last4 =

                order.PaymentLast4,



            status =

                order.PaymentStatus

        },



        items =

            order.Items.Select(

                item => new

                {

                    orderItemId =

                        item.OrderItemId,



                    productId =

                        item.ProductId,



                    name =

                        item.ProductName,



                    size =

                        item.SelectedSize,



                    quantity =

                        item.Quantity,



                    unitPrice =

                        item.UnitPrice,



                    lineTotal =

                        item.LineTotal,



                    image =

                        productImages

                            .TryGetValue(

                                item.ProductId,

                                out var imagePath

                            )

                                ? imagePath

                                : ""

                }

            ),



        itemCount =

            order.Items.Sum(

                item =>

                    item.Quantity

            ),



        subtotal =

            order.TotalAmount,



        total =

            order.TotalAmount

    };





    return Results.Ok(

        result

    );

})

.RequireAuthorization();

// ONE-TIME LOCAL PRODUCT CATALOGUE IMPORT



if (builder.Configuration.GetValue<bool>("import-products"))

{

    if (!app.Environment.IsDevelopment())

    {

        throw new InvalidOperationException(

            "Product import is only available in development."

        );

    }



    using var scope = app.Services.CreateScope();



    var db = scope.ServiceProvider

        .GetRequiredService<StrideXDbContext>();



    var productJsPath = Path.Combine(

        app.Environment.ContentRootPath,

        "Data",

        "product.js"

    );



    var count = await ProductCatalogImporter.ImportAsync(

        db,

        productJsPath

    );



    Console.WriteLine(

        $"StrideX import complete: {count} products."

    );



    return;

}


// =====================================
// STRIDEX — VIEW MY CUSTOM KIT ORDERS
// =====================================

app.MapGet("/api/custom-kits", async (
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    StrideXDbContext db) =>
{
    var user =
        await userManager.GetUserAsync(
            httpContext.User
        );

    if (user is null)
    {
        return Results.Unauthorized();
    }

    var orders =
        await db.CustomKitOrders
            .AsNoTracking()
            .Include(order => order.Players)
            .Where(order => order.UserId == user.Id)
            .OrderByDescending(order => order.CreatedAt)
            .ToListAsync();

    var result =
        orders.Select(order => new
        {
            customKitOrderId = order.CustomKitOrderId,
            sport = order.Sport,
            garment = order.Garment,
            template = order.Template,
            primaryColour = order.PrimaryColour,
            secondaryColour = order.SecondaryColour,
            accentColour = order.AccentColour,
            teamName = order.TeamName,
            quantity = order.Quantity,
            pricePerKit = order.PricePerKit,
            estimatedTotal = order.EstimatedTotal,
            status = order.Status,
            createdAt = order.CreatedAt,
            playerCount = order.Players.Count,
            canEdit = string.Equals(
                order.Status,
                "Pending",
                StringComparison.OrdinalIgnoreCase
            ),
            canCancel = string.Equals(
                order.Status,
                "Pending",
                StringComparison.OrdinalIgnoreCase
            ),
            canPay = string.Equals(
                order.Status,
                "Pending",
                StringComparison.OrdinalIgnoreCase
            )
        });

    return Results.Ok(result);
})
.RequireAuthorization();


// =====================================
// STRIDEX — VIEW ONE CUSTOM KIT ORDER
// =====================================

app.MapGet("/api/custom-kits/{customKitOrderId:int}", async (
    int customKitOrderId,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    StrideXDbContext db) =>
{
    var user =
        await userManager.GetUserAsync(
            httpContext.User
        );

    if (user is null)
    {
        return Results.Unauthorized();
    }

    var order =
        await db.CustomKitOrders
            .AsNoTracking()
            .Include(item => item.Players)
            .SingleOrDefaultAsync(
                item =>
                    item.CustomKitOrderId == customKitOrderId &&
                    item.UserId == user.Id
            );

    if (order is null)
    {
        return Results.NotFound(new
        {
            message = "Custom kit order not found."
        });
    }

    var isPending =
        string.Equals(
            order.Status,
            "Pending",
            StringComparison.OrdinalIgnoreCase
        );

    return Results.Ok(new
    {
        customKitOrderId = order.CustomKitOrderId,
        sport = order.Sport,
        garment = order.Garment,
        template = order.Template,
        primaryColour = order.PrimaryColour,
        secondaryColour = order.SecondaryColour,
        accentColour = order.AccentColour,
        teamName = order.TeamName,
        crest = order.CrestData,
        quantity = order.Quantity,
        pricePerKit = order.PricePerKit,
        estimatedTotal = order.EstimatedTotal,
        status = order.Status,
        createdAt = order.CreatedAt,
        canEdit = isPending,
        canCancel = isPending,
        canPay = isPending,
        players = order.Players
            .OrderBy(player => player.CustomKitPlayerId)
            .Select(player => new
            {
                customKitPlayerId = player.CustomKitPlayerId,
                playerName = player.PlayerName,
                playerNumber = player.PlayerNumber,
                size = player.Size
            })
    });
})
.RequireAuthorization();

// =====================================

// STRIDEX — SUBMIT CUSTOM KIT REQUEST

// =====================================



app.MapPost("/api/custom-kits", async (

    CustomKitRequest request,

    HttpContext httpContext,

    UserManager<ApplicationUser> userManager,

    StrideXDbContext db) =>

{

    var user =

        await userManager.GetUserAsync(

            httpContext.User

        );



    if (user is null)

    {

        return Results.Unauthorized();

    }





    var allowedSports =

        new HashSet<string>(

            StringComparer.OrdinalIgnoreCase

        )

        {

            "Soccer",

            "Rugby",

            "Tennis",

            "Cycling"

        };





    var allowedTemplates =

        new HashSet<string>(

            StringComparer.OrdinalIgnoreCase

        )

        {

            "Velocity",

            "Apex",

            "Phantom"

        };





    var allowedSizes =

        new HashSet<string>(

            StringComparer.OrdinalIgnoreCase

        )

        {

            "XS",

            "S",

            "M",

            "L",

            "XL",

            "XXL"

        };





    var allowedGarments =

        new Dictionary<string, string>(

            StringComparer.OrdinalIgnoreCase

        )

        {

            ["Soccer"] =

                "Jersey + Shorts",



            ["Rugby"] =

                "Rugby Jersey + Shorts",



            ["Tennis"] =

                "Top + Skirt",



            ["Cycling"] =

                "Cycling Jersey + Shorts"

        };





    if (

        string.IsNullOrWhiteSpace(

            request.TeamName

        ) ||

        request.TeamName.Trim().Length > 100

    )

    {

        return Results.BadRequest(new

        {

            message =

                "Enter a valid team name."

        });

    }





    if (

        !allowedSports.Contains(

            request.Sport

        )

    )

    {

        return Results.BadRequest(new

        {

            message =

                "Invalid sport."

        });

    }





    if (

        !allowedGarments.TryGetValue(

            request.Sport,

            out var expectedGarment

        ) ||

        !string.Equals(

            request.Garment,

            expectedGarment,

            StringComparison.OrdinalIgnoreCase

        )

    )

    {

        return Results.BadRequest(new

        {

            message =

                "Invalid garment for this sport."

        });

    }




    if (

        !allowedTemplates.Contains(

            request.Template

        )

    )

    {

        return Results.BadRequest(new

        {

            message =

                "Invalid kit design."

        });

    }





    bool ValidColour(string value) =>

        !string.IsNullOrWhiteSpace(value) &&

        System.Text.RegularExpressions.Regex.IsMatch(

            value,

            "^#[0-9a-fA-F]{6}$"

        );





    if (

        !ValidColour(

            request.PrimaryColour

        ) ||

        !ValidColour(

            request.SecondaryColour

        ) ||

        !ValidColour(

            request.AccentColour

        )

    )

    {

        return Results.BadRequest(new

        {

            message =

                "One or more kit colours are invalid."

        });

    }





    if (

        request.Players is null ||

        request.Players.Count < 1 ||

        request.Players.Count > 100

    )

    {

        return Results.BadRequest(new

        {

            message =

                "Add at least one player."

        });

    }





    foreach (

        var player in request.Players

    )

    {

        if (

            string.IsNullOrWhiteSpace(

                player.Size

            ) ||

            !allowedSizes.Contains(

                player.Size

            )

        )

        {

            return Results.BadRequest(new

            {

                message =

                    "Every player must have a valid size."

            });

        }





        if (

            player.PlayerName is not null &&

            player.PlayerName.Trim().Length > 100

        )

        {

            return Results.BadRequest(new

            {

                message =

                    "A player name is too long."

            });

        }





        if (

            player.PlayerNumber is not null &&

            (

                player.PlayerNumber < 0 ||

                player.PlayerNumber > 99

            )

        )

        {

            return Results.BadRequest(new

            {

                message =

                    "Player numbers must be between 0 and 99."

            });

        }

    }





    // Server-side pricing.

    // Never trust the total supplied by the browser.



    var basePrice =

        request.Sport switch

        {

            "Soccer" => 999.99m,

            "Rugby" => 1099.99m,

            "Tennis" => 899.99m,

            "Cycling" => 949.99m,

            _ => 0m

        };





    var garmentExtra =

        request.Sport switch

        {

            "Rugby" => 100m,

            _ => 0m

        };





    var templateExtra =

        request.Template switch

        {

            "Apex" => 100m,

            "Phantom" => 150m,

            _ => 0m

        };





    var pricePerKit =

        basePrice +

        garmentExtra +

        templateExtra;





    var quantity =

        request.Players.Count;





    var estimatedTotal =

        pricePerKit *

        quantity;





    var customKitOrder =

        new CustomKitOrder

        {

            UserId =

                user.Id,



            Sport =

                request.Sport,



            Garment =

                request.Garment,



            Template =

                request.Template,



            PrimaryColour =

                request.PrimaryColour,



            SecondaryColour =

                request.SecondaryColour,



            AccentColour =

                request.AccentColour,



            TeamName =

                request.TeamName.Trim(),



            CrestData =

                request.Crest,



            Quantity =

                quantity,



            PricePerKit =

                pricePerKit,



            EstimatedTotal =

                estimatedTotal,



            Status =

                "Pending",



            CreatedAt =

                DateTime.UtcNow

        };





    foreach (

        var player in request.Players

    )

    {

        customKitOrder.Players.Add(

            new CustomKitPlayer

            {

                PlayerName =

                    player.PlayerName?

                        .Trim() ?? "",



                PlayerNumber =

                    player.PlayerNumber?

                        .ToString() ?? "",



                Size =

                    player.Size

            }

        );

    }





    db.CustomKitOrders.Add(

        customKitOrder

    );



    await db.SaveChangesAsync();





    return Results.Ok(new

    {

        message =

            "Custom kit request submitted successfully.",



        customKitOrderId =

            customKitOrder.CustomKitOrderId,



        quantity =

            customKitOrder.Quantity,



        pricePerKit =

            customKitOrder.PricePerKit,



        estimatedTotal =

            customKitOrder.EstimatedTotal,



        status =

            customKitOrder.Status

    });

})

.RequireAuthorization();


// =====================================
// STRIDEX — EDIT CUSTOM KIT ORDER
// Only Pending requests can be edited.
// =====================================

app.MapPut("/api/custom-kits/{customKitOrderId:int}", async (
    int customKitOrderId,
    CustomKitRequest request,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    StrideXDbContext db) =>
{
    var user =
        await userManager.GetUserAsync(
            httpContext.User
        );

    if (user is null)
    {
        return Results.Unauthorized();
    }

    var customKitOrder =
        await db.CustomKitOrders
            .Include(order => order.Players)
            .SingleOrDefaultAsync(
                order =>
                    order.CustomKitOrderId == customKitOrderId &&
                    order.UserId == user.Id
            );

    if (customKitOrder is null)
    {
        return Results.NotFound(new
        {
            message = "Custom kit order not found."
        });
    }

    if (!string.Equals(
        customKitOrder.Status,
        "Pending",
        StringComparison.OrdinalIgnoreCase
    ))
    {
        return Results.BadRequest(new
        {
            message =
                "Only Pending custom kit orders can be edited."
        });
    }

    var allowedSports =
        new HashSet<string>(
            StringComparer.OrdinalIgnoreCase
        )
        {
            "Soccer",
            "Rugby",
            "Tennis",
            "Cycling"
        };

    var allowedTemplates =
        new HashSet<string>(
            StringComparer.OrdinalIgnoreCase
        )
        {
            "Velocity",
            "Apex",
            "Phantom"
        };

    var allowedSizes =
        new HashSet<string>(
            StringComparer.OrdinalIgnoreCase
        )
        {
            "XS",
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        };

    var allowedGarments =
        new Dictionary<string, string>(
            StringComparer.OrdinalIgnoreCase
        )
        {
            ["Soccer"] = "Jersey + Shorts",
            ["Rugby"] = "Rugby Jersey + Shorts",
            ["Tennis"] = "Top + Skirt",
            ["Cycling"] = "Cycling Jersey + Shorts"
        };

    if (
        string.IsNullOrWhiteSpace(request.TeamName) ||
        request.TeamName.Trim().Length > 100
    )
    {
        return Results.BadRequest(new
        {
            message = "Enter a valid team name."
        });
    }

    if (!allowedSports.Contains(request.Sport))
    {
        return Results.BadRequest(new
        {
            message = "Invalid sport."
        });
    }

    if (
        !allowedGarments.TryGetValue(
            request.Sport,
            out var expectedGarment
        ) ||
        !string.Equals(
            request.Garment,
            expectedGarment,
            StringComparison.OrdinalIgnoreCase
        )
    )
    {
        return Results.BadRequest(new
        {
            message = "Invalid garment for this sport."
        });
    }

    if (!allowedTemplates.Contains(request.Template))
    {
        return Results.BadRequest(new
        {
            message = "Invalid kit design."
        });
    }

    bool ValidColour(string value) =>
        !string.IsNullOrWhiteSpace(value) &&
        System.Text.RegularExpressions.Regex.IsMatch(
            value,
            "^#[0-9a-fA-F]{6}$"
        );

    if (
        !ValidColour(request.PrimaryColour) ||
        !ValidColour(request.SecondaryColour) ||
        !ValidColour(request.AccentColour)
    )
    {
        return Results.BadRequest(new
        {
            message = "One or more kit colours are invalid."
        });
    }

    if (
        request.Players is null ||
        request.Players.Count < 1 ||
        request.Players.Count > 100
    )
    {
        return Results.BadRequest(new
        {
            message = "Add at least one player."
        });
    }

    foreach (var player in request.Players)
    {
        if (
            string.IsNullOrWhiteSpace(player.Size) ||
            !allowedSizes.Contains(player.Size)
        )
        {
            return Results.BadRequest(new
            {
                message =
                    "Every player must have a valid size."
            });
        }

        if (
            player.PlayerName is not null &&
            player.PlayerName.Trim().Length > 100
        )
        {
            return Results.BadRequest(new
            {
                message = "A player name is too long."
            });
        }

        if (
            player.PlayerNumber is not null &&
            (
                player.PlayerNumber < 0 ||
                player.PlayerNumber > 99
            )
        )
        {
            return Results.BadRequest(new
            {
                message =
                    "Player numbers must be between 0 and 99."
            });
        }
    }

    var basePrice =
        request.Sport switch
        {
            "Soccer" => 999.99m,
            "Rugby" => 1099.99m,
            "Tennis" => 899.99m,
            "Cycling" => 949.99m,
            _ => 0m
        };

    var garmentExtra =
        request.Sport switch
        {
            "Rugby" => 100m,
            _ => 0m
        };

    var templateExtra =
        request.Template switch
        {
            "Apex" => 100m,
            "Phantom" => 150m,
            _ => 0m
        };

    var pricePerKit =
        basePrice +
        garmentExtra +
        templateExtra;

    var quantity = request.Players.Count;
    var estimatedTotal = pricePerKit * quantity;

    customKitOrder.Sport = request.Sport;
    customKitOrder.Garment = request.Garment;
    customKitOrder.Template = request.Template;
    customKitOrder.PrimaryColour = request.PrimaryColour;
    customKitOrder.SecondaryColour = request.SecondaryColour;
    customKitOrder.AccentColour = request.AccentColour;
    customKitOrder.TeamName = request.TeamName.Trim();
    customKitOrder.CrestData = request.Crest;
    customKitOrder.Quantity = quantity;
    customKitOrder.PricePerKit = pricePerKit;
    customKitOrder.EstimatedTotal = estimatedTotal;

    db.RemoveRange(customKitOrder.Players);
    customKitOrder.Players.Clear();

    foreach (var player in request.Players)
    {
        customKitOrder.Players.Add(
            new CustomKitPlayer
            {
                PlayerName = player.PlayerName?.Trim() ?? "",
                PlayerNumber =
                    player.PlayerNumber?.ToString() ?? "",
                Size = player.Size
            }
        );
    }

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Custom kit order updated successfully.",
        customKitOrderId = customKitOrder.CustomKitOrderId,
        quantity = customKitOrder.Quantity,
        pricePerKit = customKitOrder.PricePerKit,
        estimatedTotal = customKitOrder.EstimatedTotal,
        status = customKitOrder.Status
    });
})
.RequireAuthorization();


// =====================================
// STRIDEX — PAY FOR CUSTOM KIT ORDER
// Payment is simulated for the semester project.
// Only the final four card digits reach the API.
// =====================================

app.MapPost("/api/custom-kits/{customKitOrderId:int}/pay", async (
    int customKitOrderId,
    CustomKitPaymentRequest request,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    StrideXDbContext db) =>
{
    var user =
        await userManager.GetUserAsync(
            httpContext.User
        );

    if (user is null)
    {
        return Results.Unauthorized();
    }

    var last4 =
        new string(
            (request.PaymentLast4 ?? "")
                .Where(char.IsDigit)
                .ToArray()
        );

    if (last4.Length != 4)
    {
        return Results.BadRequest(new
        {
            message = "Payment information is invalid."
        });
    }

    var customKitOrder =
        await db.CustomKitOrders
            .SingleOrDefaultAsync(
                order =>
                    order.CustomKitOrderId == customKitOrderId &&
                    order.UserId == user.Id
            );

    if (customKitOrder is null)
    {
        return Results.NotFound(new
        {
            message = "Custom kit order not found."
        });
    }

    if (!string.Equals(
        customKitOrder.Status,
        "Pending",
        StringComparison.OrdinalIgnoreCase
    ))
    {
        return Results.BadRequest(new
        {
            message =
                "Only Pending custom kit orders can be paid."
        });
    }

    customKitOrder.Status = "Paid";

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Custom kit payment completed successfully.",
        customKitOrderId = customKitOrder.CustomKitOrderId,
        status = customKitOrder.Status,
        paymentStatus = "Paid",
        paymentLast4 = last4
    });
})
.RequireAuthorization();


// =====================================
// STRIDEX — CANCEL CUSTOM KIT ORDER
// Only Pending requests can be cancelled.
// =====================================

app.MapPost("/api/custom-kits/{customKitOrderId:int}/cancel", async (
    int customKitOrderId,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    StrideXDbContext db) =>
{
    var user =
        await userManager.GetUserAsync(
            httpContext.User
        );

    if (user is null)
    {
        return Results.Unauthorized();
    }

    var customKitOrder =
        await db.CustomKitOrders
            .SingleOrDefaultAsync(
                order =>
                    order.CustomKitOrderId == customKitOrderId &&
                    order.UserId == user.Id
            );

    if (customKitOrder is null)
    {
        return Results.NotFound(new
        {
            message = "Custom kit order not found."
        });
    }

    if (!string.Equals(
        customKitOrder.Status,
        "Pending",
        StringComparison.OrdinalIgnoreCase
    ))
    {
        return Results.BadRequest(new
        {
            message =
                "Only Pending custom kit orders can be cancelled."
        });
    }

    customKitOrder.Status = "Cancelled";

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Custom kit order cancelled successfully.",
        customKitOrderId = customKitOrder.CustomKitOrderId,
        status = customKitOrder.Status
    });
})
.RequireAuthorization();

app.Run();



// REQUEST MODELS



record RegisterRequest(

    string FullName,

    string Email,

    string Password

);



record LoginRequest(

    string Email,

    string Password

);

record ChangePasswordRequest(

    string CurrentPassword,

    string NewPassword

);



// EXISTING WEATHER MODEL



record WeatherForecast(

    DateOnly Date,

    int TemperatureC,

    string? Summary

)

{

    public int TemperatureF =>

        32 + (int)(TemperatureC / 0.5556);

}

record AddCartItemRequest(

    string ProductId,

    string SelectedSize,

    int Quantity

);

record UpdateCartItemRequest(

    int Quantity

);

record DeleteAccountRequest(

    string CurrentPassword

);

record UpdateAccountRequest(

    string FullName,

    string Email

);

record CheckoutRequest(

    string FullName,

    string PhoneNumber,

    string StreetAddress,

    string City,

    string Province,

    string PostalCode,

    string PaymentLast4

);

record CustomKitPaymentRequest(
    string PaymentLast4
);

record CustomKitRequest(

    string Sport,

    string Garment,

    string Template,

    string PrimaryColour,

    string SecondaryColour,

    string AccentColour,

    string TeamName,

    string? Crest,

    List<CustomKitPlayerRequest> Players

);



record CustomKitPlayerRequest(

    string? PlayerName,

    int? PlayerNumber,

    string Size

);