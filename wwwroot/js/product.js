
/*
    STRIDEX PRODUCT PAGE
    Complete catalogue for Soccer, Rugby, Tennis and Cycling.

    New Rugby, Tennis and Cycling prices are provisional.
    Keep your existing image folders and filenames.
*/
const STRIDEX_API =
    window.location.protocol === "file:" ||
    window.location.port === "5500"
        ? "http://localhost:5103"
        : window.location.origin;

const products = Object.create(null);

const SIZE_OPTIONS = {
    A: ["XS", "S", "M", "L", "XL", "XXL"],
    B: ["6", "7", "8", "9", "10", "11"],
    C: ["S", "M", "L", "XL"],
    G: ["S", "M", "L"],
    K: ["7", "8", "9", "10", "11"],
    "5": ["5"],
    O: ["One Size"]
};

/*
    Each row contains:
    ID, name, price, colour, type, image(s), size group.

    For older products, ["image-1.png", 3] means
    image-1.png, image-2.png and image-3.png.

    Separate front/back filenames are written explicitly.
*/

const ROWS = [

    // =====================================================
    // SOCCER / RUGBY — SHARED BOOTS
    // =====================================================

    ["stridex-velocity","StrideX Velocity FG",1299.99,"Black / White","Boots",["images/soccer/footwear/stridex/velocity-blackwhite/stridex-velocity-blackwhite-1.png",4],"B"],

    ["stridex-phantom","StrideX Phantom Purple FG",1399.99,"Black / Purple","Boots",["images/soccer/footwear/stridex/phantom-purple/stridex-phantom-purple-1.png",4],"B"],

    ["stridex-blaze","StrideX Blaze Red FG",1449.99,"Red / Black","Boots",["images/soccer/footwear/stridex/stridex-blaze-red/stridex-blaze-red-1.png",4],"B"],

    ["stridex-volt","StrideX Volt Green FG",1399.99,"Black / Green","Boots",["images/soccer/footwear/stridex/stridex-volt-green/stridex-volt-green-1.png",4],"B"],

    ["nike-mercurial-pink","Nike Mercurial Vapor Pink FG",1899.99,"Pink / Purple","Boots",["images/soccer/footwear/nike/mercurial-vapor-pink/nike-mercurial-vapor-pink-1.png",4],"B"],

    ["nike-mercurial-red","Nike Mercurial Vapor Red FG",1999.99,"Red","Boots",["images/soccer/footwear/nike/mercurial-vapor-red/nike-mercurial-vapor-red-1.png",4],"B"],

    ["nike-phantom-red","Nike Phantom Red FG",2099.99,"Red / Black","Boots",["images/soccer/footwear/nike/phantom-red/nike-phantom-red-1.png",4],"B"],

    ["adidas-f50","Adidas F50 Hyperfast FG",2199.99,"Black / Blue","Boots",["images/soccer/footwear/adidas/f50-hyperfast-blackblue/adidas-f50-hyperfast-blackblue-1.png",4],"B"],

    ["adidas-predator-pink","Adidas Predator White/Pink FG",2299.99,"White / Pink","Boots",["images/soccer/footwear/adidas/predator-whitepink/adidas-predator-whitepink-1.png",3],"B"],

    ["adidas-predator-gold","Adidas Predator White/Gold FG",2499.99,"White / Gold","Boots",["images/soccer/footwear/adidas/predator-whitegold/adidas-predator-whitegold-1.png",4],"B"],

    ["puma-playmaker","Puma Future Playmaker Blue FG",1899.99,"Blue / Pink / Lime","Boots",["images/soccer/footwear/puma/future-playmaker-blue/puma-future-playmaker-blue-1.png",4],"B"],

    ["puma-ultra-iceblue","Puma Ultra Ice Blue FG",1999.99,"Ice Blue / Navy","Boots",["images/soccer/footwear/puma/ultra-iceblue/puma-ultra-iceblue-1.png",4],"B"],

    ["puma-ultra-redwhite","Puma Ultra Red/White FG",1949.99,"Red / White","Boots",["images/soccer/footwear/puma/ultra-redwhite/puma-ultra-redwhite-1.png",4],"B"],


    // =====================================================
    // SOCCER — JERSEYS, SHORTS AND SOCKS
    // =====================================================

    ["stridex-phantom-blackpurple-jersey","StrideX Phantom Black/Purple Jersey",849.99,"Black / Purple","Jersey",["images/apparel/jerseys/stridex/phantom-blackpurple/stridex-phantom-blackpurple-jersey-1.png",3],"A"],

    ["stridex-phantom-blackpurple-shorts","StrideX Phantom Black/Purple Shorts",449.99,"Black / Purple","Shorts",["images/apparel/shorts/stridex/phantom-blackpurple/stridex-phantom-blackpurple-shorts-1.png",3],"A"],

    ["stridex-phantom-blackpurple-socks","StrideX Phantom Black/Purple Socks",199.99,"Black / Purple","Socks",["images/apparel/socks/stridex/phantom-blackpurple/stridex-phantom-blackpurple-socks-1.png",3],"C"],

    ["stridex-velocity-whitepurple-jersey","StrideX Velocity White/Purple Jersey",799.99,"White / Purple","Jersey",["images/apparel/jerseys/stridex/velocity-whitepurple/stridex-velocity-whitepurple-jersey-1.png",3],"A"],

    ["stridex-velocity-whitepurple-shorts","StrideX Velocity White/Purple Shorts",429.99,"White / Purple","Shorts",["images/apparel/shorts/stridex/velocity-whitepurple/stridex-velocity-whitepurple-shorts-1.png",3],"A"],

    ["stridex-velocity-whitepurple-socks","StrideX Velocity White/Purple Socks",189.99,"White / Purple","Socks",["images/apparel/socks/stridex/velocity-whitepurple/stridex-velocity-whitepurple-socks-1.png",3],"C"],

    ["stridex-flare-pinkwhite-jersey","StrideX Flare Pink/White Jersey",829.99,"Pink / White","Jersey",["images/apparel/jerseys/stridex/flare-pinkwhite/stridex-flare-pinkwhite-jersey-1.png",3],"A"],

    ["stridex-flare-pinkwhite-shorts","StrideX Flare Pink/White Shorts",439.99,"Pink / White","Shorts",["images/apparel/shorts/stridex/flare-pinkwhite/stridex-flare-pinkwhite-shorts-1.png",3],"A"],

    ["stridex-flare-pinkwhite-socks","StrideX Flare Pink/White Socks",199.99,"Pink / White","Socks",["images/apparel/socks/stridex/flare-pinkwhite/stridex-flare-pinkwhite-socks-1.png",3],"C"],

    ["nike-strike-blackwhite-jersey","Nike Strike Black/White Jersey",1199.99,"Black / White","Jersey",["images/apparel/jerseys/nike/strike-blackwhite/nike-strike-blackwhite-jersey-1.png",3],"A"],

    ["nike-strike-blackwhite-shorts","Nike Strike Black/White Shorts",699.99,"Black / White","Shorts",["images/apparel/shorts/nike/strike-blackwhite/nike-strike-blackwhite-shorts-1.png",3],"A"],

    ["nike-strike-blackwhite-socks","Nike Strike Black/White Socks",299.99,"Black / White","Socks",["images/apparel/socks/nike/strike-blackwhite/nike-strike-blackwhite-socks-1.png",3],"C"],

    ["nike-pulse-blackblue-jersey","Nike Pulse Black/Blue Jersey",1249.99,"Black / Electric Blue","Jersey",["images/apparel/jerseys/nike/pulse-blackblue/nike-pulse-blackblue-jersey-1.png",3],"A"],

    ["nike-pulse-blackblue-shorts","Nike Pulse Black/Blue Shorts",729.99,"Black / Electric Blue","Shorts",["images/apparel/shorts/nike/pulse-blackblue/nike-pulse-blackblue-shorts-1.png",3],"A"],

    ["nike-pulse-blackblue-socks","Nike Pulse Black/Blue Socks",319.99,"Black / Electric Blue","Socks",["images/apparel/socks/nike/pulse-blackblue/nike-pulse-blackblue-socks-1.png",3],"C"],

    ["nike-volt-limewhite-jersey","Nike Volt Lime/White Jersey",1299.99,"Lime / White","Jersey",["images/apparel/jerseys/nike/volt-limewhite/nike-volt-limewhite-jersey-1.png",3],"A"],

    ["nike-volt-limewhite-shorts","Nike Volt Lime/White Shorts",749.99,"Lime / White","Shorts",["images/apparel/shorts/nike/volt-limewhite/nike-volt-limewhite-shorts-1.png",3],"A"],

    ["nike-volt-limewhite-socks","Nike Volt Lime/White Socks",329.99,"Lime / White","Socks",["images/apparel/socks/nike/volt-limewhite/nike-volt-limewhite-socks-1.png",3],"C"],

    ["adidas-aero-navyteal-jersey","Adidas Aero Navy/Teal Jersey",1149.99,"Navy / Teal","Jersey",["images/apparel/jerseys/adidas/aero-navyteal/adidas-aero-navyteal-jersey-1.png",3],"A"],

    ["adidas-aero-navyteal-shorts","Adidas Aero Navy/Teal Shorts",649.99,"Navy / Teal","Shorts",["images/apparel/shorts/adidas/aero-navyteal/adidas-aero-navyteal-shorts-1.png",3],"A"],

    ["adidas-aero-navyteal-socks","Adidas Aero Navy/Teal Socks",279.99,"Navy / Teal","Socks",["images/apparel/socks/adidas/aero-navyteal/adidas-aero-navyteal-socks-1.png",3],"C"],

    ["adidas-vortex-blackcoral-jersey","Adidas Vortex Black/Coral Jersey",1199.99,"Black / Coral","Jersey",["images/apparel/jerseys/adidas/vortex-blackcoral/adidas-vortex-blackcoral-jersey-1.png",3],"A"],

    ["adidas-vortex-blackcoral-shorts","Adidas Vortex Black/Coral Shorts",679.99,"Black / Coral","Shorts",["images/apparel/shorts/adidas/vortex-blackcoral/adidas-vortex-blackcoral-shorts-1.png",3],"A"],

    ["adidas-vortex-blackcoral-socks","Adidas Vortex Black/Coral Socks",289.99,"Black / Coral","Socks",["images/apparel/socks/adidas/vortex-blackcoral/adidas-vortex-blackcoral-socks-1.png",3],"C"],

    ["adidas-blush-whitepink-jersey","Adidas Blush White/Pink Jersey",1249.99,"White / Pink","Jersey",["images/apparel/jerseys/adidas/blush-whitepink/adidas-blush-whitepink-jersey-1.png",3],"A"],

    ["adidas-blush-whitepink-shorts","Adidas Blush White/Pink Shorts",699.99,"White / Pink","Shorts",["images/apparel/shorts/adidas/blush-whitepink/adidas-blush-whitepink-shorts-1.png",3],"A"],

    ["adidas-blush-whitepink-socks","Adidas Blush White/Pink Socks",299.99,"White / Pink","Socks",["images/apparel/socks/adidas/blush-whitepink/adidas-blush-whitepink-socks-1.png",3],"C"],

    ["puma-heritage-ivoryburgundy-jersey","Puma Heritage Ivory/Burgundy Jersey",1099.99,"Ivory / Burgundy / Gold","Jersey",["images/apparel/jerseys/puma/heritage-ivoryburgundy/puma-heritage-ivoryburgundy-jersey-1.png",3],"A"],

    ["puma-heritage-ivoryburgundy-shorts","Puma Heritage Ivory/Burgundy Shorts",599.99,"Ivory / Burgundy / Gold","Shorts",["images/apparel/shorts/puma/heritage-ivoryburgundy/puma-heritage-ivoryburgundy-shorts-1.png",3],"A"],

    ["puma-heritage-ivoryburgundy-socks","Puma Heritage Ivory/Burgundy Socks",269.99,"Ivory / Burgundy / Gold","Socks",["images/apparel/socks/puma/heritage-ivoryburgundy/puma-heritage-ivoryburgundy-socks-1.png",3],"C"],

    ["puma-velocity-blackorange-jersey","Puma Velocity Black/Orange Jersey",1149.99,"Black / Orange / Grey","Jersey",["images/apparel/jerseys/puma/velocity-blackorange/puma-velocity-blackorange-jersey-1.png",3],"A"],

    ["puma-velocity-blackorange-shorts","Puma Velocity Black/Orange Shorts",629.99,"Black / Orange / Grey","Shorts",["images/apparel/shorts/puma/velocity-blackorange/puma-velocity-blackorange-shorts-1.png",3],"A"],

    ["puma-velocity-blackorange-socks","Puma Velocity Black/Orange Socks",279.99,"Black / Orange / Grey","Socks",["images/apparel/socks/puma/velocity-blackorange/puma-velocity-blackorange-socks-1.png",3],"C"],


    // =====================================================
    // SOCCER BALLS
    // =====================================================

    ["stridex-apex-tealgold-ball","StrideX Apex Teal/Gold Ball",349.99,"Black / Teal / Gold","Soccer Ball","images/balls/stridex/stridex-apex-tealgold.png","5"],

    ["stridex-pulse-navynorange-ball","StrideX Pulse Navy/Orange Ball",329.99,"Navy / Orange / Teal","Soccer Ball","images/balls/stridex/stridex-pulse-navynorange.png","5"],

    ["stridex-strike-whiteorange-ball","StrideX Strike White/Orange Ball",299.99,"White / Navy / Orange","Soccer Ball","images/balls/stridex/stridex-strike-whiteorange.png","5"],

    ["stridex-pure-white-ball","StrideX Pure White Ball",279.99,"White","Soccer Ball","images/balls/stridex/stridex-pure-white.png","5"],

    ["stridex-volt-blacklime-ball","StrideX Volt Black/Lime Ball",319.99,"Black / Lime","Soccer Ball","images/balls/stridex/stridex-volt-blacklime.png","5"],

    ["stridex-aero-whiteteal-ball","StrideX Aero White/Teal Ball",339.99,"White / Teal / Black","Soccer Ball","images/balls/stridex/stridex-aero-whiteteal.png","5"],

    ["nike-strike-redgold-ball","Nike Strike Red/Gold Ball",449.99,"Red / Gold / Black","Soccer Ball","images/balls/nike/nike-strike-redgold.png","5"],

    ["nike-precision-goldteal-ball","Nike Precision Gold/Teal Ball",549.99,"Gold / Teal / Black","Soccer Ball","images/balls/nike/nike-precision-goldteal.png","5"],

    ["nike-academy-whitered-ball","Nike Academy White/Red Ball",399.99,"White / Red / Black","Soccer Ball","images/balls/nike/nike-academy-whitered.png","5"],

    ["adidas-pulse-orange-ball","Adidas Pulse Orange Ball",499.99,"Orange","Soccer Ball","images/balls/adidas/adidas-pulse-orange.png","5"],

    ["adidas-elite-whitegold-ball","Adidas Elite White/Gold Ball",699.99,"White / Gold / Black","Soccer Ball","images/balls/adidas/adidas-elite-whitegold.png","5"],

    ["adidas-star-whitesilver-ball","Adidas Star White/Silver Ball",799.99,"White / Silver","Soccer Ball","images/balls/adidas/adidas-star-whitesilver.png","5"],


    // =====================================================
    // SOCCER GOALKEEPER GLOVES
    // =====================================================

    ["stridex-keeper-limewhite","StrideX Keeper Lime/White Gloves",699.99,"White / Lime / Black","Goalkeeper Gloves","images/gloves/stridex/stridex-keeper-limewhite.png","K"],

    ["stridex-keeper-blackwhite","StrideX Keeper Black/White Gloves",749.99,"Black / White","Goalkeeper Gloves","images/gloves/stridex/stridex-keeper-blackwhite.png","K"],

    ["stridex-keeper-bluewhite","StrideX Keeper Blue/White Gloves",729.99,"Blue / White / Black","Goalkeeper Gloves","images/gloves/stridex/stridex-keeper-bluewhite.png","K"],

    ["nike-keeper-blueorange","Nike Keeper Blue/Orange Gloves",899.99,"Blue / Black / Orange","Goalkeeper Gloves","images/gloves/nike/nike-keeper-blueorange.png","K"],

    ["nike-keeper-blackred","Nike Keeper Black/Red Gloves",949.99,"Black / Red / Gold","Goalkeeper Gloves","images/gloves/nike/nike-keeper-blackred.png","K"],

    ["puma-keeper-whitecoral","Puma Keeper White/Coral Gloves",849.99,"White / Coral / Black","Goalkeeper Gloves","images/gloves/puma/puma-keeper-whitecoral.png","K"],

    ["puma-keeper-whitecoral-classic","Puma Keeper White/Coral Classic Gloves",799.99,"White / Coral","Goalkeeper Gloves","images/gloves/puma/puma-keeper-whitecoral-classic.png","K"],


    // =====================================================
    // TENNIS — EXISTING SETS AND DRESSES
    // =====================================================

    ["stridex-tennis-velocity-whitepurple-set","StrideX Velocity White/Purple Tennis Set",999.99,"White / Purple","Tennis Set",["images/tennis/apparel/stridex/sets/velocity-whitepurple/stridex-velocity-whitepurple-tennis-set-1.png",3],"A"],

    ["stridex-tennis-aero-tealcoral-set","StrideX Aero Teal/Coral Tennis Set",949.99,"Teal / Coral","Tennis Set",["images/tennis/apparel/stridex/sets/aero-tealcoral/stridex-aero-tealcoral-tennis-set-1.png",2],"A"],

    ["stridex-tennis-blossom-blushlilac-set","StrideX Blossom Blush/Lilac Tennis Set",1049.99,"Blush Pink / Lilac / White","Tennis Set",["images/tennis/apparel/stridex/sets/blossom-blushlilac/stridex-blossom-blushlilac-tennis-set-1.png",3],"A"],

    ["stridex-tennis-sunlit-yellowwhite-dress","StrideX Sunlit Yellow/White Tennis Dress",899.99,"Yellow / White","Tennis Dress",["images/tennis/apparel/stridex/dresses/stridex/sunlit-yellowwhite/stridex-sunlit-yellowwhite-dress-1.png",3],"A"],

    ["stridex-tennis-blush-pinkwhite-dress","StrideX Blush Pink/White Tennis Dress",929.99,"Pink / White","Tennis Dress",["images/tennis/apparel/stridex/dresses/stridex/blush-pinkwhite/stridex-blush-pinkwhite-dress-1.png",3],"A"],

    ["nike-tennis-court-ivorytealcoral-set","Nike Court Ivory/Teal/Coral Tennis Set",1499.99,"Ivory / Teal / Coral","Tennis Set",["images/tennis/apparel/nike/sets/court-ivorytealcoral/nike-court-ivorytealcoral-tennis-set-1.png",3],"A"],

    ["nike-tennis-volt-blackfuchsia-set","Nike Volt Black/Fuchsia Tennis Set",1549.99,"Black / Fuchsia / Aqua","Tennis Set",["images/tennis/apparel/nike/sets/volt-blackfuchsia/nike-volt-blackfuchsia-tennis-set-1.png",3],"A"],

    ["nike-tennis-lavender-white-dress","Nike Lavender/White Tennis Dress",1399.99,"Lavender / White / Silver","Tennis Dress",["images/tennis/apparel/nike/dresses/lavender-white/nike-lavender-white-dress-1.png",3],"A"],

    ["nike-tennis-forest-green-dress","Nike Forest Green Tennis Dress",1449.99,"Forest Green / White","Tennis Dress",["images/tennis/apparel/nike/dresses/forest-green/nike-forest-green-dress-1.png",3],"A"],

    ["puma-tennis-velocity-blackorange-set","Puma Velocity Black/Orange Tennis Set",1299.99,"Black / Orange / White","Tennis Set",["images/tennis/apparel/puma/sets/velocity-blackorange/puma-velocity-blackorange-tennis-set-1.png",3],"A"],

    ["puma-tennis-heritage-plumpink-set","Puma Heritage Plum/Pink Tennis Set",1349.99,"Plum / Pink / White","Tennis Set",["images/tennis/apparel/puma/sets/aero-creamred/puma-heritage-plumpink-tennis-set-1.png",3],"A"],


    // =====================================================
    // TENNIS — EXISTING ACCESSORIES AND EQUIPMENT
    // =====================================================

    ["nike-tennis-whitecoral-visor","Nike White/Coral Tennis Visor",449.99,"White / Coral","Tennis Visor","images/tennis/accessories/visors/nike/white-coral/nike-white-coral-visor.png","O"],

    ["stridex-tennis-lavenderwhite-visor","StrideX Lavender/White Tennis Visor",349.99,"White / Lavender","Tennis Visor","images/tennis/accessories/visors/stridex/lavender-white/stridex-lavender-white-visor.png","O"],

    ["stridex-tennis-creampink-visor","StrideX Cream/Pink Tennis Visor",329.99,"Cream / Pink","Tennis Visor","images/tennis/accessories/visors/cream-pink/stridex-cream-pink-visor.png","O"],

    ["puma-tennis-blackpink-gloves","Puma Black/Pink Training Gloves",499.99,"Black / Pink","Training Gloves","images/tennis/accessories/gloves/puma/black-pink/puma-black-pink-training-gloves.png","G"],

    ["stridex-tennis-lilaccoral-gloves","StrideX Lilac/Coral Training Gloves",399.99,"White / Lilac / Coral","Training Gloves","images/tennis/accessories/gloves/stridex/lilac-coral-white/stridex-lilac-coral-training-gloves.png","G"],

    ["stridex-tennis-blackhotpink-gloves","StrideX Black/Hot Pink Training Gloves",379.99,"Black / Hot Pink","Training Gloves","images/tennis/accessories/gloves/stridex/black-hotpink/stridex-black-hotpink-training-gloves.png","G"],

    ["stridex-tennis-lavenderwhite-knee-support","StrideX Lavender/White Knee Support",299.99,"Lavender / White","Knee Support","images/tennis/accessories/knee-supports/stridex/lavender-white/stridex-lavender-white-knee-support.png","C"],

    ["stridex-tennis-lavenderpink-knee-support","StrideX Lavender/Pink Knee Support",319.99,"Lavender / Pink / Grey","Knee Support","images/tennis/accessories/knee-supports/stridex/lavender-pink/stridex-lavender-pink-knee-support.png","C"],

    ["stridex-tennis-pastelpink-knee-support","StrideX Pastel Pink Knee Support",289.99,"Pastel Pink / Grey","Knee Support","images/tennis/accessories/knee-supports/stridex/pastel-pink/stridex-pastel-pink-knee-support.png","C"],

    ["adidas-tennis-whiteblackblue-bag","Adidas White/Black/Blue Tennis Bag",1199.99,"White / Black / Blue","Tennis Bag","images/tennis/accessories/bags/adidas/white-black-blue/adidas-white-black-blue-tennis-bag.png","O"],

    ["stridex-tennis-tealcoral-equipment-set","StrideX Teal/Coral Tennis Equipment Set",1799.99,"Teal / White / Coral","Tennis Equipment Set","images/tennis/accessories/sets/stridex/teal-coral/stridex-teal-coral-tennis-set.png","O"],

    ["stridex-tennis-purpleblack-equipment-set","StrideX Purple/Black Tennis Equipment Set",1699.99,"Purple / Black / Blue","Tennis Equipment Set","images/tennis/accessories/sets/stridex/purple-black/stridex-purple-black-tennis-set.png","O"],


    // =====================================================
    // TENNIS — NEW SHOES
    // =====================================================

    ["stridex-tennis-blue-court","StrideX Blue Court Tennis Shoes",999.99,"White / Blue","Tennis Shoes","images/tennis/shoes/blue-court/stridex-blue-court-shoes.png","B"],

    ["stridex-tennis-blush-court","StrideX Blush Court Tennis Shoes",999.99,"Cream / Blush","Tennis Shoes","images/tennis/shoes/blush-court/stridex-blush-court-shoes.png","B"],

    ["stridex-tennis-crimson-court","StrideX Crimson Court Tennis Shoes",1049.99,"Black / Red","Tennis Shoes","images/tennis/shoes/crimson-court/stridex-crimson-court-shoes.png","B"],

    ["stridex-tennis-ivory-court","StrideX Ivory Court Tennis Shoes",999.99,"Cream / Grey","Tennis Shoes","images/tennis/shoes/ivory-court/stridex-ivory-court-shoes.png","B"],

    ["stridex-tennis-violet-court","StrideX Violet Court Tennis Shoes",1049.99,"Black / Purple","Tennis Shoes","images/tennis/shoes/violet-court/stridex-violet-court-shoes.png","B"],


    // =====================================================
    // TENNIS — NEW BALLS
    // =====================================================

    ["stridex-tennis-blush-set","StrideX Blush Set Tennis Balls (3-Pack)",159.99,"Pink","Tennis Balls","images/tennis/stridex/balls/blush-set/stridex-blush-set-balls.png","O"],

    ["stridex-tennis-classic","StrideX Classic Tennis Balls (3-Pack)",139.99,"Yellow","Tennis Balls","images/tennis/stridex/balls/classic/stridex-classic-balls.png","O"],

    ["stridex-tennis-crimson-rally","StrideX Crimson Rally Tennis Balls (3-Pack)",159.99,"Yellow / Red","Tennis Balls","images/tennis/stridex/balls/crimson-rally/stridex-crimson-rally-balls.png","O"],

    ["stridex-tennis-purple-spin","StrideX Purple Spin Tennis Balls (3-Pack)",179.99,"Purple","Tennis Balls","images/tennis/stridex/balls/purple-spin/stridex-purple-spin-balls.png","O"],


    // =====================================================
    // BASIC SOCKS — AVAILABLE TO ALL FOUR SPORTS
    // =====================================================

    ["stridex-tennis-court-crew","StrideX Court Crew Socks (3-Pack)",169.99,"White / Lime","Socks","images/tennis/stridex/socks/court-crew/stridex-court-crew-socks.png","C"],

    ["stridex-tennis-everyday-ankle","StrideX Everyday Ankle Socks (3-Pack)",149.99,"White / Black","Socks","images/tennis/stridex/socks/everyday-ankle/stridex-everyday-ankle-socks.png","C"],


    // =====================================================
    // CYCLING — ADIDAS
    // =====================================================

    ["adidas-cycling-blue-sprint-bottoms","Adidas Blue Sprint Cycling Bottoms",749.99,"Blue","Bottoms",[
        "images/cycling/adidas/bottoms/blue-sprint/adidas-blue-sprint-front.png",
        "images/cycling/adidas/bottoms/blue-sprint/adidas-blue-sprint-back.png"
    ],"A"],

    ["adidas-cycling-blue-sprint-shoes","Adidas Blue Sprint Cycling Shoes",1499.99,"Blue","Cycling Shoes","images/cycling/adidas/shoes/blue-sprint/adidas-blue-sprint.png","B"],


    // =====================================================
    // CYCLING — NIKE
    // =====================================================

    ["nike-cycling-volt-grip-gloves","Nike Volt Grip Cycling Gloves",349.99,"Volt","Cycling Gloves","images/cycling/nike/gloves/volt-grip/nike-volt-grip-gloves.png","G"],

    ["nike-cycling-coral-rush-top","Nike Coral Rush Cycling Top",799.99,"Coral","Tops",[
        "images/cycling/nike/tops/coral-rush/nike-coral-rush-front.png",
        "images/cycling/nike/tops/coral-rush/nike-coral-rush-back.png"
    ],"A"],

    ["nike-cycling-volt-sprint-top","Nike Volt Sprint Cycling Top",799.99,"Volt","Tops",[
        "images/cycling/nike/tops/volt-sprint/nike-volt-sprint-front.png",
        "images/cycling/nike/tops/volt-sprint/nike-volt-sprint-back.png"
    ],"A"],


    // =====================================================
    // CYCLING — PUMA
    // =====================================================

    ["puma-cycling-pink-pulse-gloves","Puma Pink Pulse Cycling Gloves",329.99,"Pink","Cycling Gloves","images/cycling/puma/gloves/pink-pulse/puma-pink-pulse-gloves.png","G"],

    ["puma-cycling-pink-pulse-shoes","Puma Pink Pulse Cycling Shoes",1399.99,"Pink","Cycling Shoes","images/cycling/puma/shoes/pink-pulse/puma-pink-pulse.png","B"],

    ["puma-cycling-forest-sprint-vest","Puma Forest Sprint Cycling Vest",649.99,"Forest Green","Vests",[
        "images/cycling/puma/vests/forest-sprint/puma-forest-sprint-front.png",
        "images/cycling/puma/vests/forest-sprint/puma-forest-sprint-back.png"
    ],"A"],

    ["puma-cycling-magenta-pulse-bottle","Puma Magenta Pulse Water Bottle",199.99,"Magenta","Water Bottles","images/cycling/puma/water-bottles/magenta-pulse/puma-magenta-pulse.png","O"],


    // =====================================================
    // CYCLING — STRIDEX BICYCLES
    // =====================================================

    ["stridex-cycling-race-300-bicycle","StrideX Race 300 Bicycle",12499.99,"Mixed","Bicycles",[
        "images/cycling/stridex/bicycles/race-300/stridex-race-300-view-1.png",2
    ],"O"],

    ["stridex-cycling-trail-500-bicycle","StrideX Trail 500 Bicycle",9999.99,"Mixed","Bicycles",[
        "images/cycling/stridex/bicycles/trail-500/stridex-trail-500-view-1.png",2
    ],"O"],


    // =====================================================
    // CYCLING — STRIDEX BOTTOMS
    // =====================================================

    ["stridex-cycling-violet-ride-bottoms","StrideX Violet Ride Cycling Bottoms",699.99,"Violet","Bottoms",[
        "images/cycling/stridex/bottoms/violet-ride/stridex-violet-ride-1.png",2
    ],"A"],


    // =====================================================
    // CYCLING — STRIDEX GLOVES
    // =====================================================

    ["stridex-cycling-crimson-grip-gloves","StrideX Crimson Grip Cycling Gloves",299.99,"Crimson","Cycling Gloves","images/cycling/stridex/gloves/crimson-grip/stridex-crimson-grip-gloves.png","G"],

    ["stridex-cycling-violet-grip-gloves","StrideX Violet Grip Cycling Gloves",299.99,"Violet","Cycling Gloves","images/cycling/stridex/gloves/violet-grip/stridex-violet-grip-gloves.png","G"],


    // =====================================================
    // CYCLING — STRIDEX HELMETS
    // =====================================================

    ["stridex-cycling-crimson-rush-helmet","StrideX Crimson Rush Cycling Helmet",899.99,"Crimson","Cycling Helmets","images/cycling/stridex/helmets/crimson-rush/stridex-crimson-rush.png","C"],

    ["stridex-cycling-purple-vortex-helmet","StrideX Purple Vortex Cycling Helmet",899.99,"Purple","Cycling Helmets","images/cycling/stridex/helmets/purple-vortex/stridex-purple-vortex.png","C"],

    ["stridex-cycling-violet-aero-helmet","StrideX Violet Aero Cycling Helmet",899.99,"Violet","Cycling Helmets","images/cycling/stridex/helmets/violet-aero/stridex-violet-aero.png","C"],


    // =====================================================
    // CYCLING — STRIDEX SHOES
    // =====================================================

    ["stridex-cycling-crimson-rush-shoes","StrideX Crimson Rush Cycling Shoes",1249.99,"Crimson","Cycling Shoes","images/cycling/stridex/shoes/crimson-rush/stridex-crimson-rush-shoes.png","B"],

    ["stridex-cycling-violet-ride-shoes","StrideX Violet Ride Cycling Shoes",1249.99,"Violet","Cycling Shoes","images/cycling/stridex/shoes/violet-ride/stridex-violet-ride.png","B"],


    // =====================================================
    // CYCLING — STRIDEX SUNGLASSES
    // =====================================================

    ["stridex-cycling-arctic-prism-sunglasses","StrideX Arctic Prism Cycling Sunglasses",449.99,"Arctic","Sunglasses","images/cycling/stridex/sunglasses/arctic-prism/stridex-arctic-prism.png","O"],

    ["stridex-cycling-crimson-shadow-sunglasses","StrideX Crimson Shadow Cycling Sunglasses",449.99,"Crimson","Sunglasses","images/cycling/stridex/sunglasses/crimson-shadow/stridex-crimson-shadow.png","O"],

    ["stridex-cycling-purple-apex-sunglasses","StrideX Purple Apex Cycling Sunglasses",449.99,"Purple","Sunglasses","images/cycling/stridex/sunglasses/purple-apex/stridex-purple-apex.png","O"],

    ["stridex-cycling-sunset-blaze-sunglasses","StrideX Sunset Blaze Cycling Sunglasses",449.99,"Sunset","Sunglasses","images/cycling/stridex/sunglasses/sunset-blaze/stridex-sunset-blaze.png","O"],


    // =====================================================
    // CYCLING — STRIDEX TOPS
    // =====================================================

    ["stridex-cycling-blue-surge-top","StrideX Blue Surge Cycling Top",649.99,"Blue","Tops",[
        "images/cycling/stridex/tops/blue-surge/stridex-blue-surge-front.png",
        "images/cycling/stridex/tops/blue-surge/stridex-blue-surge-back.png"
    ],"A"],

    ["stridex-cycling-crimson-flare-top","StrideX Crimson Flare Cycling Top",649.99,"Crimson","Tops",[
        "images/cycling/stridex/tops/crimson-flare/stridex-crimson-flare-front.png",
        "images/cycling/stridex/tops/crimson-flare/stridex-crimson-flare-back.png"
    ],"A"],


    // =====================================================
    // CYCLING — STRIDEX WATER BOTTLES
    // =====================================================

    ["stridex-cycling-purple-flow-bottle","StrideX Purple Flow Water Bottle",179.99,"Purple","Water Bottles","images/cycling/stridex/water-bottles/purple-flow/stridex-purple-flow.png","O"],

    ["stridex-cycling-volt-hydrate-bottle","StrideX Volt Hydrate Water Bottle",179.99,"Volt","Water Bottles","images/cycling/stridex/water-bottles/volt-hydrate/stridex-volt-hydrate.png","O"],


    // =====================================================
    // CYCLING — STRIDEX WINDBREAKERS
    // =====================================================

    ["stridex-cycling-arctic-teal-windbreaker","StrideX Arctic Teal Cycling Windbreaker",999.99,"Teal","Windbreakers","images/cycling/stridex/windbreakers/arctic-teal/stridex-arctic-teal-front.png","A"],

    ["stridex-cycling-violet-rush-windbreaker","StrideX Violet Rush Cycling Windbreaker",999.99,"Violet","Windbreakers",[
        "images/cycling/stridex/windbreakers/violet-rush/stridex-violet-rush-front.png",
        "images/cycling/stridex/windbreakers/violet-rush/stridex-violet-rush-back.png"
    ],"A"],


    // =====================================================
    // RUGBY — SHORTS AND TEES
    // =====================================================

    ["adidas-rugby-black-white-grey-shorts","Adidas Black/White/Grey Rugby Shorts",599.99,"Black / White / Grey","Rugby Shorts","images/rugby/apparel/shorts/adidas/black-white-grey/adidas-black-white-grey-rugby-shorts-1.png","A"],

    ["nike-rugby-navy-teal-coral-shorts","Nike Navy/Teal/Coral Rugby Shorts",649.99,"Navy / Teal / Coral","Rugby Shorts","images/rugby/apparel/shorts/nike/navy-teal-coral/nike-navy-teal-coral-rugby-shorts-1.png","A"],

    ["puma-rugby-black-plum-pink-shorts","Puma Black/Plum/Pink Rugby Shorts",599.99,"Black / Plum / Pink","Rugby Shorts","images/rugby/apparel/shorts/puma/black-plum-pink/puma-black-plum-pink-rugby-shorts-1.png","A"],

    ["stridex-rugby-black-purple-shorts","StrideX Black/Purple Rugby Shorts",449.99,"Black / Purple","Rugby Shorts","images/rugby/apparel/shorts/stridex/black-purple/stridex-black-purple-rugby-shorts-1.png","A"],

    ["stridex-rugby-voltstorm-shorts","StrideX VoltStorm Black/Blue Rugby Shorts",499.99,"Black / Blue","Rugby Shorts","images/rugby/apparel/shorts/stridex/voltstorm-blackblue/stridex-voltstorm-blackblue-rugby-shorts-1.png","A"],

    ["nike-rugby-navy-teal-coral-tee","Nike Navy/Teal/Coral Rugby Tee",799.99,"Navy / Teal / Coral","Rugby Tee","images/rugby/apparel/tees/nike/navy-teal-coral/nike-navy-teal-coral-rugby-tee-1.png","A"],

    ["puma-rugby-black-plum-pink-tee","Puma Black/Plum/Pink Rugby Tee",749.99,"Black / Plum / Pink","Rugby Tee","images/rugby/apparel/tees/puma/black-plum-pink/puma-black-plum-pink-rugby-tee-1.png","A"],

    ["stridex-rugby-black-purple-tee","StrideX Black/Purple Rugby Tee",649.99,"Black / Purple","Rugby Tee","images/rugby/apparel/tees/stridex/black-purple/stridex-black-purple-rugby-tee-1.png","A"],
  // NINE NEW RUGBY PRODUCTS
  ["stridex-rugby-phantom-scrum-cap","StrideX Phantom Black/Purple Scrum Cap",449.99,"Black / Purple","Scrum Cap","images/rugby/new-products/stridex-phantom-scrum-cap.jpg","C"],
  ["stridex-rugby-teal-kicking-tee","StrideX Teal Rugby Kicking Tee",189.99,"Teal","Kicking Tee","images/rugby/new-products/stridex-teal-kicking-tee.jpg","O"],
  ["stridex-rugby-blue-mouthguard","StrideX Blue Rugby Mouthguard",139.99,"Blue","Mouthguard","images/rugby/new-products/stridex-blue-mouthguard.jpg","O"],
  ["stridex-rugby-phantom-ball","StrideX Phantom Black/Purple Rugby Ball",399.99,"Black / Purple / White","Rugby Ball","images/rugby/new-products/stridex-phantom-rugby-ball.png","5"],
  ["puma-rugby-blackpink-ball","Puma Black/Pink Rugby Ball",449.99,"Black / Pink","Rugby Ball","images/rugby/new-products/puma-blackpink-rugby-ball.png","5"],
  ["stridex-rugby-royal-bluegold-tee","StrideX Royal Blue/Gold Rugby Tee",699.99,"Royal Blue / Gold","Rugby Tee","images/rugby/new-products/stridex-royal-bluegold-rugby-tee.jpg","A"],
  ["stridex-rugby-white-navygold-tee","StrideX White/Navy/Gold Rugby Tee",699.99,"White / Navy / Gold","Rugby Tee","images/rugby/new-products/stridex-white-navygold-rugby-tee.jpg","A"],
  ["stridex-rugby-white-navygold-shorts","StrideX White/Navy/Gold Rugby Shorts",429.99,"White / Navy / Gold","Rugby Shorts","images/rugby/new-products/stridex-white-navygold-rugby-shorts.jpg","A"],
  ["stridex-rugby-blue-sprint-shorts","StrideX Blue Sprint Rugby Shorts",449.99,"Navy / Blue","Rugby Shorts","images/rugby/new-products/tridex-blue-sprint-rugby-shorts.jpg","A"]
];


// =========================================================
// BUILD PRODUCT RECORDS
// =========================================================

for (const row of ROWS) {

    const [
        id,
        name,
        price,
        colour,
        type,
        photo,
        sizeGroup
    ] = row;

    const brand = id.split("-")[0].toUpperCase();

    const sport = id.includes("-rugby-")
        ? "Rugby"
        : id.includes("-tennis-")
        ? "Tennis"
        : id.includes("-cycling-")
        ? "Cycling"
        : "Soccer";


    // Decide which filter category this product belongs to.

    const cartCategory = [
        "Boots",
        "Tennis Shoes",
        "Cycling Shoes"
    ].includes(type)
        ? "footwear"

        : [
            "Soccer Ball",
            "Tennis Balls",
            "Tennis Equipment Set",
            "Bicycles","Rugby Ball","Kicking Tee"
        ].includes(type)
        ? "equipment"

        : [
            "Jersey",
            "Shorts",
            "Socks",
            "Tennis Set",
            "Tennis Dress",
            "Rugby Tee",
            "Rugby Shorts",
            "Tops",
            "Bottoms",
            "Vests",
            "Windbreakers"
        ].includes(type)
        ? "apparel"

        : "accessories";


    const category =
        cartCategory.charAt(0).toUpperCase() +
        cartCategory.slice(1) +
        " / " +
        type;


    // Shared products belong to more than one sport.

    const sports = type === "Boots"

        ? ["soccer", "rugby"]

        : [
            "stridex-tennis-court-crew",
            "stridex-tennis-everyday-ankle"
        ].includes(id)

        ? ["soccer", "rugby", "tennis", "cycling"]

        : [sport.toLowerCase()];


    // Some products have one image, some have multiple views.

    let images;

    if (typeof photo === "string") {

        images = [photo];

    } else if (typeof photo[1] === "number") {

        images = Array.from(
            { length: photo[1] },
            function (_, index) {

                return photo[0].replace(
                    /-1\.png$/,
                    "-" + (index + 1) + ".png"
                );

            }
        );

    } else {

        images = photo;

    }


    products[id] = {

        brand: brand,
        name: name,
        price: price,
        colour: colour,

        sport: sport,
        sports: sports,

        category: category,
        cartCategory: cartCategory,
        type: type,

        images: images,

        description:
            name +
            ". Browse the available product views and choose " +
            "your size before adding to cart.",

        sizes: SIZE_OPTIONS[sizeGroup]

    };

}


// =========================================================
// FIND PRODUCT FROM URL
// =========================================================

const params = new URLSearchParams(
    window.location.search
);

const requestedProductId = params.get("id");

const currentProductId = requestedProductId;

const currentProduct = products[currentProductId];


// =========================================================
// PAGE ELEMENTS
// =========================================================

function el(id) {

    return document.getElementById(id);

}

const productBrand = el("productBrand");
const productName = el("productName");
const productPrice = el("productPrice");
const productDescription = el("productDescription");

const fullProductDescription = el(
    "fullProductDescription"
);

const productSport = el("productSport");
const productCategory = el("productCategory");
const productColour = el("productColour");
const breadcrumbProduct = el("breadcrumbProduct");

const mainProductImage = el("mainProductImage");
const productThumbnails = el("productThumbnails");
const zoomContainer = el("zoomContainer");
const previousImageButton = el("previousImageButton");
const nextImageButton = el("nextImageButton");
const imageCounter = el("imageCounter");

const sizeButtons = Array.from(
    document.querySelectorAll(".size-button")
);
const selectedSizeStatus = el("selectedSizeStatus");

const quantityValue = el("quantityValue");
const decreaseQuantity = el("decreaseQuantity");
const increaseQuantity = el("increaseQuantity");

const cartCount = el("cartCount");
const addToCartButton = el("addToCartButton");
const buyNowButton = el("buyNowButton");
const productStockStatus = el("productStockStatus");
const productNotice = el("productNotice");

let selectedSize = null;
let quantity = 1;
let stockQuantity = null;
let currentImageIndex = 0;


// =========================================================
// FORMAT PRICE
// =========================================================

function formatPrice(price) {

    return (
        "R" +
        Number(price)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    );

}

function showProductNotice(message, isError) {
    if (!productNotice) return;

    productNotice.textContent = message;
    productNotice.classList.toggle("error", Boolean(isError));
    productNotice.hidden = false;

    window.clearTimeout(showProductNotice.timer);
    showProductNotice.timer = window.setTimeout(
        function () {
            productNotice.hidden = true;
        },
        3500
    );
}

function updateSelectedSizeStatus() {
    if (!selectedSizeStatus) return;

    selectedSizeStatus.classList.remove(
        "available",
        "low",
        "out"
    );

    if (!selectedSize) {
        selectedSizeStatus.textContent =
            stockQuantity === 0
                ? "Sizes unavailable — product is out of stock."
                : "Choose a size.";
        if (stockQuantity === 0) {
            selectedSizeStatus.classList.add("out");
        }
        return;
    }

    if (stockQuantity === null) {
        selectedSizeStatus.textContent =
            "Selected size: " +
            selectedSize +
            " • Stock will be checked when added to cart.";
        return;
    }

    if (stockQuantity <= 0) {
        selectedSizeStatus.textContent =
            "Selected size: " +
            selectedSize +
            " • Out of Stock";
        selectedSizeStatus.classList.add("out");
    } else if (stockQuantity <= 5) {
        selectedSizeStatus.textContent =
            "Selected size: " +
            selectedSize +
            " • Low Stock";
        selectedSizeStatus.classList.add("low");
    } else {
        selectedSizeStatus.textContent =
            "Selected size: " +
            selectedSize +
            " • Available";
        selectedSizeStatus.classList.add("available");
    }
}

async function loadInventory() {
    if (!currentProductId || !currentProduct) return;

    try {
        const response = await fetch(
            STRIDEX_API +
            "/api/inventory/" +
            encodeURIComponent(currentProductId)
        );

        if (!response.ok) {
            throw new Error("Inventory unavailable");
        }

        const inventory = await response.json();
        stockQuantity = Number(inventory.quantity) || 0;

        if (productStockStatus) {
            productStockStatus.classList.remove("low", "out");

            if (stockQuantity <= 0) {
                productStockStatus.textContent = "Out of Stock";
                productStockStatus.classList.add("out");
            } else if (stockQuantity <= 5) {
                productStockStatus.textContent =
                    "Low Stock — only " +
                    stockQuantity +
                    " left";
                productStockStatus.classList.add("low");
            } else {
                productStockStatus.textContent =
                    "In Stock — " +
                    stockQuantity +
                    " available";
            }
        }

        if (addToCartButton) {
            addToCartButton.disabled = stockQuantity <= 0;
            if (stockQuantity <= 0) {
                addToCartButton.textContent = "Out of Stock";
            }
        }

        if (buyNowButton) {
            buyNowButton.disabled = stockQuantity <= 0;
        }

        if (
            increaseQuantity &&
            stockQuantity <= quantity
        ) {
            increaseQuantity.disabled = true;
        }

        sizeButtons.forEach(function (button) {
            if (button.style.display !== "none") {
                button.disabled = stockQuantity <= 0;
            }
        });

        updateSelectedSizeStatus();
    } catch (error) {
        stockQuantity = null;

        if (productStockStatus) {
            productStockStatus.textContent =
                "Stock availability unavailable";
            productStockStatus.classList.add("low");
        }

        updateSelectedSizeStatus();
    }
}


// =========================================================
// IMAGE ZOOM RESET
// =========================================================

function resetZoom() {

    if (!mainProductImage) {
        return;
    }

    mainProductImage.style.transform = "scale(1)";

    mainProductImage.style.transformOrigin =
        "center center";

}


// =========================================================
// PRODUCT IMAGE GALLERY
// =========================================================

function selectProductImage(index) {
    if (
        !currentProduct ||
        !mainProductImage ||
        !currentProduct.images.length
    ) {
        return;
    }

    const total = currentProduct.images.length;

    currentImageIndex =
        (index + total) % total;

    mainProductImage.src =
        currentProduct.images[
            currentImageIndex
        ];

    mainProductImage.alt =
        currentProduct.name +
        " view " +
        (currentImageIndex + 1);

    if (imageCounter) {
        imageCounter.textContent =
            (currentImageIndex + 1) +
            " / " +
            total;
    }

    if (previousImageButton) {
        previousImageButton.disabled =
            total <= 1;
    }

    if (nextImageButton) {
        nextImageButton.disabled =
            total <= 1;
    }

    productThumbnails
        ?.querySelectorAll(
            ".product-thumbnail"
        )
        .forEach(
            function (thumb, thumbIndex) {
                thumb.classList.toggle(
                    "active-thumbnail",
                    thumbIndex ===
                        currentImageIndex
                );
            }
        );

    resetZoom();
}

function loadProductImages() {

    if (!mainProductImage || !productThumbnails) {
        return;
    }

    productThumbnails.innerHTML = "";
    currentImageIndex = 0;

    currentProduct.images.forEach(
        function (imagePath, index) {

            const button = document.createElement(
                "button"
            );

            button.type = "button";
            button.className = "product-thumbnail";
            button.setAttribute(
                "aria-label",
                "Show product image " +
                (index + 1)
            );

            const image = document.createElement(
                "img"
            );

            image.src = imagePath;

            image.alt =
                currentProduct.name +
                " view " +
                (index + 1);

            button.appendChild(image);

            button.addEventListener(
                "click",
                function () {
                    selectProductImage(
                        index
                    );
                }
            );

            productThumbnails.appendChild(button);
        }
    );

    selectProductImage(0);
}

if (previousImageButton) {
    previousImageButton.addEventListener(
        "click",
        function () {
            selectProductImage(
                currentImageIndex - 1
            );
        }
    );
}

if (nextImageButton) {
    nextImageButton.addEventListener(
        "click",
        function () {
            selectProductImage(
                currentImageIndex + 1
            );
        }
    );
}


// =========================================================
// LOAD PRODUCT SIZES
// =========================================================

function loadSizes() {

    selectedSize = null;

    updateSelectedSizeStatus();

    sizeButtons.forEach(
        function (button, index) {

            const size = currentProduct.sizes[index];

            button.classList.remove(
                "selected-size"
            );

            button.setAttribute(
                "aria-pressed",
                "false"
            );

            button.style.display =
                size === undefined
                    ? "none"
                    : "";

            if (size !== undefined) {

                button.textContent = size;

            }

        }
    );


    // One-size products should not require an extra click.

    if (currentProduct.sizes.length === 1) {

        selectedSize = currentProduct.sizes[0];

        if (sizeButtons[0]) {

            sizeButtons[0].classList.add(
                "selected-size"
            );

            sizeButtons[0].setAttribute(
                "aria-pressed",
                "true"
            );

            updateSelectedSizeStatus();

        }

    }

}


// =========================================================
// LOAD PRODUCT INFORMATION
// =========================================================

function loadProduct() {

    if (!currentProduct) {

        if (productName) {

            productName.textContent =
                "Product not found";

        }

        if (productDescription) {

            productDescription.textContent =
                "Return to Shop to choose an available product.";

        }

        if (fullProductDescription) {

            fullProductDescription.textContent =
                "Return to Shop to choose an available product.";

        }

        if (mainProductImage) {

            mainProductImage.style.display = "none";

        }

        if (addToCartButton) {

            addToCartButton.disabled = true;

        }

        if (buyNowButton) {

            buyNowButton.disabled = true;

        }

        document.title =
            "Product not found | StrideX Sports";

        return;

    }


    if (productBrand) {

        productBrand.textContent =
            currentProduct.brand;

    }

    if (productName) {

        productName.textContent =
            currentProduct.name;

    }

    if (productPrice) {

        productPrice.textContent =
            formatPrice(currentProduct.price);

    }

    if (productDescription) {

        productDescription.textContent =
            currentProduct.description;

    }

    if (fullProductDescription) {

        fullProductDescription.textContent =
            currentProduct.description;

    }

    if (productSport) {

        productSport.textContent =
            currentProduct.sports
                .map(function (sport) {

                    return (
                        sport.charAt(0).toUpperCase() +
                        sport.slice(1)
                    );

                })
                .join(" / ");

    }

    if (productCategory) {

        productCategory.textContent =
            currentProduct.category;

    }

    if (productColour) {

        productColour.textContent =
            currentProduct.colour;

    }

    if (breadcrumbProduct) {

        breadcrumbProduct.textContent =
            currentProduct.name;

    }

    document.title =
        currentProduct.name +
        " | StrideX Sports";

    loadProductImages();

    loadSizes();

}


// =========================================================
// SELECT A SIZE
// =========================================================

sizeButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                if (
                    !currentProduct ||
                    button.style.display === "none"
                ) {
                    return;
                }

                sizeButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected-size"
                        );

                        item.setAttribute(
                            "aria-pressed",
                            "false"
                        );

                    }
                );

                button.classList.add(
                    "selected-size"
                );

                button.setAttribute(
                    "aria-pressed",
                    "true"
                );

                selectedSize =
                    button.textContent.trim();

                updateSelectedSizeStatus();

            }
        );

    }
);


// =========================================================
// IMAGE ZOOM
// =========================================================

if (zoomContainer && mainProductImage) {

    zoomContainer.addEventListener(
        "mousemove",
        function (event) {

            if (!currentProduct) {
                return;
            }

            const rect =
                zoomContainer.getBoundingClientRect();

            const x =
                (
                    (event.clientX - rect.left) /
                    rect.width
                ) * 100;

            const y =
                (
                    (event.clientY - rect.top) /
                    rect.height
                ) * 100;

            mainProductImage.style.transformOrigin =
                x + "% " + y + "%";

            mainProductImage.style.transform =
                "scale(2)";

        }
    );

    zoomContainer.addEventListener(
        "mouseleave",
        resetZoom
    );

}


// =========================================================
// QUANTITY
// =========================================================

if (increaseQuantity) {

    increaseQuantity.addEventListener(
        "click",
        function () {

            if (
                stockQuantity !== null &&
                quantity >= stockQuantity
            ) {
                showProductNotice(
                    "You have reached the available stock for this product.",
                    true
                );
                return;
            }

            quantity += 1;

            if (quantityValue) {

                quantityValue.textContent =
                    quantity;

            }

            if (
                increaseQuantity &&
                stockQuantity !== null
            ) {
                increaseQuantity.disabled =
                    quantity >= stockQuantity;
            }

        }
    );

}

if (decreaseQuantity) {

    decreaseQuantity.addEventListener(
        "click",
        function () {

            quantity = Math.max(
                1,
                quantity - 1
            );

            if (quantityValue) {

                quantityValue.textContent =
                    quantity;

            }

            if (
                increaseQuantity &&
                stockQuantity !== null
            ) {
                increaseQuantity.disabled =
                    quantity >= stockQuantity;
            }

        }
    );

}


// =========================================================
// CART
// =========================================================


// =========================================================
// CART — CONNECTED TO THE C# BACKEND
// =========================================================

const API_BASE = "";

// Get the real cart count from MySQL.
async function updateCartCount() {
    if (!cartCount) {
        return;
    }

    try {
        const response = await fetch(
            STRIDEX_API + "/api/cart",
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            cartCount.textContent = "0";
            return;
        }

        const cart = await response.json();

        cartCount.textContent = cart.itemCount ?? 0;
    } catch (error) {
        console.error("Could not load cart count:", error);
    }
}


// =========================================================
// ADD CURRENT PRODUCT TO MYSQL CART
// =========================================================

async function addCurrentProductToCart(showConfirmation) {
    if (!currentProduct) {
        return false;
    }

    if (!selectedSize) {
        showProductNotice(
            "Please select a size before adding this product to your cart.",
            true
        );

        return false;
    }

    if (addToCartButton) {
        addToCartButton.disabled = true;
    }

    if (buyNowButton) {
        buyNowButton.disabled = true;
    }

    try {
        const response = await fetch(
            STRIDEX_API + "/api/cart/items",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: currentProductId,
                    selectedSize: selectedSize,
                    quantity: quantity
                })
            }
        );

        if (response.status === 401) {
            showProductNotice(
                "Please log in before adding products to your cart.",
                true
            );

            window.setTimeout(function () {
                window.location.href =
                    "account.html?mode=login&return=" +
                    encodeURIComponent(
                        "product.xhtml?id=" +
                        currentProductId
                    );
            }, 700);
            return false;
        }

        const result = await response.json().catch(
            () => ({})
        );

        if (!response.ok) {
            throw new Error(
                result.message ||
                result.detail ||
                "Could not add this product to your cart."
            );
        }

        // Only update the count AFTER MySQL confirms success.
        await updateCartCount();

        if (showConfirmation && addToCartButton) {
            const previousText =
                addToCartButton.textContent;

            addToCartButton.textContent = "Added ✓";
            showProductNotice("Added to your cart.", false);

            setTimeout(() => {
                addToCartButton.textContent =
                    previousText;
            }, 1200);
        }

        return true;
    } catch (error) {
        console.error("Add to Cart failed:", error);

        showProductNotice(
            error.message ||
            "Could not connect to the StrideX backend.",
            true
        );

        return false;
    } finally {
        if (addToCartButton) {
            addToCartButton.disabled =
                stockQuantity !== null &&
                stockQuantity <= 0;
        }

        if (buyNowButton) {
            buyNowButton.disabled =
                stockQuantity !== null &&
                stockQuantity <= 0;
        }
    }
}


// =========================================================
// ADD TO CART BUTTON
// =========================================================

if (addToCartButton) {
    addToCartButton.addEventListener(
        "click",
        async function () {
            await addCurrentProductToCart(true);
        }
    );
}


// =========================================================
// BUY NOW BUTTON
// =========================================================

if (buyNowButton) {
    buyNowButton.addEventListener(
        "click",
        async function () {
            const added =
                await addCurrentProductToCart(false);

            if (added) {
                window.location.href = "checkout.html";
            }
        }
    );
}


// =========================================================
// START PRODUCT PAGE
// =========================================================

loadProduct();

loadInventory();

updateCartCount();