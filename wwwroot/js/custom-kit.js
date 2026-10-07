document.addEventListener("DOMContentLoaded", function () {



    /* =====================================================

       STRIDEX KITLAB

       ===================================================== */



    const byId = id =>

        document.getElementById(id);

    const API_BASE = "";

    const editOrderId = Number(new URLSearchParams(window.location.search).get("editId")) || null;





    /* =====================================================

       MAIN PAGE ELEMENTS

       ===================================================== */



    const sportButtons = [

        ...document.querySelectorAll(

            ".kitlab-sport-button"

        )

    ];



    const templateCards = [

        ...document.querySelectorAll(

            ".kit-template-card"

        )

    ];



    const steps = [

        ...document.querySelectorAll(

            ".kitlab-progress-item"

        )

    ];





    const primary =

        byId("primaryColour");



    const secondary =

        byId("secondaryColour");



    const accent =

        byId("accentColour");





    const team =

        byId("teamName");



    const player =

        byId("playerName");



    const number =

        byId("playerNumber");



    const crestInput =

        byId("teamCrest");





    const size =

        byId("kitSize");



    const quantityInput =

        byId("kitQuantity");





    const stage =

        byId("kitPreviewStage");



    const previewImage =

        byId("kitPreviewImage");



    const colourOverlay =

        byId("kitColourOverlay");



    const secondaryOverlay =

        byId("kitSecondaryOverlay");



    const accentOverlay =

        byId("kitAccentOverlay");





    const frontViewButton =

        byId("frontViewButton");



    const backViewButton =

        byId("backViewButton");





    const teamRoster =

        byId("teamRoster");



    const addPlayerButton =

        byId("addPlayerButton");



    const teamQuantityDisplay =

        byId("teamQuantity");





    const reviewModal =

        byId("kitReviewModal");





    /* =====================================================

       REQUIRED ELEMENTS

       ===================================================== */



    const requiredElements = [

        primary,

        secondary,

        accent,

        team,

        size,

        quantityInput,

        stage,

        previewImage,

        colourOverlay,

        secondaryOverlay,

        accentOverlay,

        frontViewButton,

        backViewButton,

        teamRoster,

        addPlayerButton,

        teamQuantityDisplay

    ];





    if (

        requiredElements.some(

            element => !element

        )

    ) {



        console.error(

            "KitLab: one or more required elements are missing."

        );



        return;



    }





    /* =====================================================

       FOUR SPORTS

       ===================================================== */



    const garments = {



        Soccer: [

            "Jersey + Shorts"

        ],



        Rugby: [

            "Rugby Jersey + Shorts"

        ],



        Tennis: [

            "Top + Skirt"

        ],



        Cycling: [

            "Cycling Jersey + Shorts"

        ]



    };





    /* =====================================================

       KIT IMAGES

       ===================================================== */



    const kitImages = {



        Soccer: {



            front:

                "images/custom-kit/soccer/soccer-front.png",



            back:

                "images/custom-kit/soccer/soccer-back.png"



        },



        Rugby: {



            front:

                "images/custom-kit/rugby/rugby-front.png",



            back:

                "images/custom-kit/rugby/rugby-back.png"



        },



        Tennis: {



            front:

                "images/custom-kit/tennis/tennis-front.png",



            back:

                "images/custom-kit/tennis/tennis-back.png"



        },



        Cycling: {



            front:

                "images/custom-kit/cycling/cycling-front.png",



            back:

                "images/custom-kit/cycling/cycling-back.png"



        }



    };





    /* =====================================================

       DESIGN STYLES

       ===================================================== */



    const designStyles = {



        Velocity: {

            name: "Velocity",

            secondaryStyle: "side-panels",

            accentStyle: "clean-stripe"

        },



        Apex: {

            name: "Apex",

            secondaryStyle: "diagonal-panel",

            accentStyle: "diagonal-stripe"

        },



        Phantom: {

            name: "Phantom",

            secondaryStyle: "center-panel",

            accentStyle: "bold-stripe"

        }



    };





    /* =====================================================

       PRICES

       ===================================================== */



    const sportPrices = {



        Soccer: 999.99,

        Rugby: 1099.99,

        Tennis: 899.99,

        Cycling: 949.99



    };





    const garmentChanges = {



        "Jersey + Shorts": 0,



        "Rugby Jersey + Shorts": 100,



        "Top + Skirt": 0,



        "Cycling Jersey + Shorts": 0



    };





    const templatePrices = {



        Velocity: 0,

        Apex: 100,

        Phantom: 150



    };





    /* =====================================================

       CURRENT DESIGN

       ===================================================== */



    let selectedSport =

        "Soccer";



    let selectedGarment =

        garments.Soccer[0];



    let selectedTemplate =

        "Velocity";



    let crestData =

        "";



    let currentStep =

        1;



    let pendingRequest =

        null;

        let previewPlayerIndex =

    0;





    const customKitState = {



        sport:

            "Soccer",



        design:

            "Velocity",



        view:

            "front",



        primaryColor:

            primary.value,



        secondaryColor:

            secondary.value,



        accentColor:

            accent.value,



        teamName:

            "",



        players:

            []



    };





    /* =====================================================

       HELPERS

       ===================================================== */



    function setText(

        id,

        value

    ) {



        const node =

            byId(id);



        if (node) {



            node.textContent =

                value;



        }



    }





    function currency(

        value

    ) {



        return (

            "R" +

            Number(value)

                .toLocaleString(

                    "en-ZA",

                    {

                        minimumFractionDigits:

                            2,



                        maximumFractionDigits:

                            2

                    }

                )

        );



    }





    function readArray(

        key

    ) {



        try {



            const value =

                JSON.parse(

                    localStorage

                        .getItem(key) ||

                    "[]"

                );



            return Array.isArray(

                value

            )

                ? value

                : [];



        } catch {



            return [];



        }



    }





    function store(

        key,

        data

    ) {



        try {



            localStorage.setItem(

                key,

                JSON.stringify(

                    data

                )

            );



            return true;



        } catch (error) {



            console.error(

                "KitLab storage error:",

                error

            );



            return false;



        }



    }





    /* =====================================================

       PROGRESS INDICATOR

       ===================================================== */



    function advance(

        step

    ) {



        currentStep =

            Math.max(

                currentStep,

                step

            );





        steps.forEach(

            function (

                node,

                index

            ) {



                node.classList.toggle(

                    "active-step",

                    index < currentStep

                );



            }

        );



    }





    /* =====================================================

       DYNAMIC APPAREL SUMMARY

       ===================================================== */



    let summaryGarment =

        null;



    let reviewGarment =

        null;





    function createSummaryGarmentRow() {



        const summaryTemplate =

            byId(

                "summaryTemplate"

            );





        if (

            !summaryTemplate ||

            !summaryTemplate.parentElement

        ) {



            return;



        }





        const row =

            document.createElement(

                "div"

            );


        row.className =

            "kitlab-summary-row";





        const label =

            document.createElement(

                "span"

            );



        label.textContent =

            "Apparel";





        const value =

            document.createElement(

                "strong"

            );





        row.append(

            label,

            value

        );





        summaryTemplate

            .parentElement

            .insertAdjacentElement(

                "afterend",

                row

            );





        summaryGarment =

            value;



    }





    function createReviewGarmentRow() {



        const reviewTemplate =

            byId(

                "reviewTemplate"

            );





        if (

            !reviewTemplate ||

            !reviewTemplate.parentElement

        ) {



            return;



        }





        const row =

            document.createElement(

                "div"

            );



        row.className =

            "kit-review-row";





        const label =

            document.createElement(

                "span"

            );



        label.textContent =

            "Apparel";





        const value =

            document.createElement(

                "strong"

            );





        row.append(

            label,

            value

        );





        reviewTemplate

            .parentElement

            .insertAdjacentElement(

                "afterend",

                row

            );





        reviewGarment =

            value;



    }





    createSummaryGarmentRow();



    createReviewGarmentRow();





    /* =====================================================

       QUANTITY AND PRICE

       ===================================================== */



    function quantity() {



        const value =

            Number(

                quantityInput.value

            );





        if (

            !Number.isFinite(

                value

            )

        ) {



            return 1;



        }





        return Math.min(

            100,



            Math.max(

                1,

                Math.floor(

                    value

                )

            )

        );



    }





    function unitPrice() {



        return (



            sportPrices[

                selectedSport

            ] +



            (

                garmentChanges[

                    selectedGarment

                ] || 0

            ) +



            templatePrices[

                selectedTemplate

            ]



        );



    }





    function updatePrice() {



        setText(

            "summaryQuantity",

            quantity()

        );





        setText(

            "estimatedPrice",



            currency(

                unitPrice() *

                quantity()

            )

        );



    }





    /* =====================================================

       COLOUR LABELS

       ===================================================== */



    function updateColourLabels() {



        setText(

            "primaryColourValue",

            primary.value

                .toUpperCase()

        );



        setText(

            "secondaryColourValue",

            secondary.value

                .toUpperCase()

        );



        setText(

            "accentColourValue",

            accent.value

                .toUpperCase()

        );



    }





    /* =====================================================

       TEAM ROSTER

       ===================================================== */



    function createRosterRow(

        data = {}

    ) {



        const row =

            document.createElement(

                "div"

            );



        row.className =

            "roster-row";



        row.setAttribute(

            "data-player-row",

            ""

        );





        const nameInput =

            document.createElement(

                "input"

            );



        nameInput.type =

            "text";



        nameInput.className =

            "roster-player-name";



        nameInput.maxLength =

            20;



        nameInput.placeholder =

            "Player name";



        nameInput.value =

            data.playerName ||

            "";





        const numberInput =

            document.createElement(

                "input"

            );



        numberInput.type =

            "number";



        numberInput.className =

            "roster-player-number";



        numberInput.min =

            "0";



        numberInput.max =

            "99";



        numberInput.placeholder =

            "10";



        numberInput.value =

            data.playerNumber ??

            "";





        const sizeSelect =

            document.createElement(

                "select"

            );



        sizeSelect.className =

            "roster-player-size";





        const sizes = [

            "",

            "XS",

            "S",

            "M",

            "L",

            "XL",

            "XXL"

        ];





        sizes.forEach(

            function (

                sizeValue

            ) {



                const option =

                    document.createElement(

                        "option"

                    );



                option.value =

                    sizeValue;



                option.textContent =

                    sizeValue ||

                    "Size";





                if (

                    data.size ===

                    sizeValue

                ) {



                    option.selected =

                        true;



                }





                sizeSelect.appendChild(

                    option

                );



            }

        );





        const removeButton =

            document.createElement(

                "button"

            );



        removeButton.type =

            "button";



        removeButton.className =

            "roster-remove-button";



        removeButton.textContent =

            "×";



        removeButton.setAttribute(

            "aria-label",

            "Remove player"

        );





        row.append(

            nameInput,

            numberInput,

            sizeSelect,

            removeButton

        );





        return row;



    }





    function getRosterRows() {



        return [

            ...teamRoster

                .querySelectorAll(

                    "[data-player-row]"

                )

        ];



    }





    function getRosterData() {



        return getRosterRows()

            .map(

                function (row) {



                    const nameInput =

                        row.querySelector(

                            ".roster-player-name"

                        );



                    const numberInput =

                        row.querySelector(

                            ".roster-player-number"

                        );



                    const sizeSelect =

                        row.querySelector(

                            ".roster-player-size"

                        );





                    return {



                        playerName:

                            nameInput

                                ? nameInput

                                    .value

                                    .trim()

                                : "",



                        playerNumber:

                            (

                                numberInput &&

                                numberInput.value !== ""

                            )

                                ? Number(

                                    numberInput.value

                                )

                                : "",



                        size:

                            sizeSelect

                                ? sizeSelect.value

                                : ""



                    };



                }

            );



    }





    function getSizeSummary() {



        const players =

            getRosterData();





        const counts =

            {};





        players.forEach(

            function (player) {



                if (

                    !player.size

                ) {



                    return;



                }





                counts[

                    player.size

                ] =

                    (

                        counts[

                            player.size

                        ] || 0

                    ) + 1;



            }

        );





        const sizes = [

            "XS",

            "S",

            "M",

            "L",

            "XL",

            "XXL"

        ];





        const summary =

            sizes



                .filter(

                    function (

                        sizeValue

                    ) {



                        return counts[

                            sizeValue

                        ];



                    }

                )



                .map(

                    function (
                        sizeValue

                    ) {



                        return (

                            sizeValue +

                            " × " +

                            counts[

                                sizeValue

                            ]

                        );



                    }

                );





        return summary.length > 0

            ? summary.join(", ")

            : "Sizes not selected";



    }





    function updateRoster() {



        const players =

            getRosterData();

      if (

    previewPlayerIndex >=

    players.length

) {



    previewPlayerIndex =

        Math.max(

            0,

            players.length - 1

        );



}





const previewPlayer =

    players[

        previewPlayerIndex

    ];



if (previewPlayer) {



    setText(

        "previewPlayerName",



        previewPlayer.playerName

            .toUpperCase() ||

        "PLAYER"

    );





    setText(

        "previewNumber",



        previewPlayer.playerNumber !== ""

            ? previewPlayer.playerNumber

            : "10"

    );



} else {



    setText(

        "previewPlayerName",

        "PLAYER"

    );





    setText(

        "previewNumber",

        "10"

    );



}





        const total =

            Math.max(

                1,

                players.length

            );





        quantityInput.value =

            total;





        teamQuantityDisplay

            .textContent =

            total;





        const firstSizedPlayer =

            players.find(

                function (player) {



                    return Boolean(

                        player.size

                    );



                }

            );





        size.value =

            firstSizedPlayer

                ? firstSizedPlayer.size

                : "M";





        customKitState.players =

            players;





        setText(

            "summarySize",

            getSizeSummary()

        );





        updatePrice();



        advance(4);



    }





    addPlayerButton

        .addEventListener(

            "click",

            function () {



                const row =

                    createRosterRow();





                teamRoster.appendChild(

                    row

                );





                updateRoster();





                const nameInput =

                    row.querySelector(

                        ".roster-player-name"

                    );





                if (

                    nameInput

                ) {



                    nameInput.focus();



                }



            }

        );





    teamRoster

        .addEventListener(

            "input",

            updateRoster

        );





    teamRoster

        .addEventListener(

            "change",

            updateRoster

        );





    teamRoster

        .addEventListener(

            "click",

            function (event) {

                teamRoster.addEventListener(

    "click",

    function (event) {



        if (

            event.target.closest(

                ".roster-remove-button"

            )

        ) {



            return;



        }





        const row =

            event.target.closest(

                "[data-player-row]"

            );





        if (!row) {

            return;

        }





        const rows =

            getRosterRows();





        previewPlayerIndex =

            rows.indexOf(

                row

            );





        rows.forEach(

            function (

                rosterRow,

                index

            ) {



                rosterRow.classList.toggle(

                    "preview-selected",

                    index ===

                    previewPlayerIndex

                );



            }

        );





        updateRoster();



    }

);



                const removeButton =

                    event.target.closest(

                        ".roster-remove-button"

                    );





                if (

                    !removeButton

                ) {



                    return;



                }





                const row =

                    removeButton.closest(

                        "[data-player-row]"

                    );





                const rows =

                    getRosterRows();





                if (

                    rows.length === 1

                ) {



                    const nameInput =

                        row.querySelector(

                            ".roster-player-name"

                        );



                    const numberInput =

                        row.querySelector(

                            ".roster-player-number"

                        );



                    const sizeSelect =

                        row.querySelector(

                            ".roster-player-size"

                        );





                    if (

                        nameInput

                    ) {



                        nameInput.value =

                            "";



                    }





                    if (

                        numberInput

                    ) {



                        numberInput.value =

                            "";



                    }





                    if (

                        sizeSelect

                    ) {



                        sizeSelect.value =

                            "";



                    }



                } else {



                    row.remove();



                }





                updateRoster();



            }

        );





    /* =====================================================

       VIEW

       ===================================================== */



    function currentView() {



        return backViewButton

            .classList

            .contains(

                "selected"

            )

                ? "back"

                : "front";



    }





    /* =====================================================

       SHARED KIT PREVIEW

       ===================================================== */



    function updateKitPreview() {



        const view =

            currentView();



            const crestPlaceholder =

    byId("crestPlaceholder");



const crestPreview =

    byId("crestPreview");



const previewTeamName =

    byId("previewTeamName");



const previewPlayerName =

    byId("previewPlayerName");



const previewNumber =

    byId("previewNumber");





if (view === "front") {



    if (crestPlaceholder) {

        crestPlaceholder.style.display =

            crestData ? "none" : "flex";

    }



    if (crestPreview) {

        crestPreview.style.display =

            crestData ? "block" : "none";

    }



    if (previewTeamName) {

        previewTeamName.style.display =

            "block";

    }



    if (previewPlayerName) {

        previewPlayerName.style.display =

            "none";

    }



    if (previewNumber) {

        previewNumber.style.display =

            "none";

    }



} else {



    if (crestPlaceholder) {

        crestPlaceholder.style.display =

            "none";

    }



    if (crestPreview) {

        crestPreview.style.display =

            "none";

    }



    if (previewTeamName) {

        previewTeamName.style.display =

            "none";

    }



    if (previewPlayerName) {

        previewPlayerName.style.display =

            "block";

    }



    if (previewNumber) {

        previewNumber.style.display =

            "block";

    }



}

            stage.classList.remove(

    "view-front",

    "view-back"

);



stage.classList.add(

    "view-" + view

);





        customKitState.sport =

            selectedSport;



        customKitState.view =

            view;



        customKitState.design =

            selectedTemplate;



        customKitState.primaryColor =

            primary.value;



        customKitState.secondaryColor =

            secondary.value;



        customKitState.accentColor =

            accent.value;



        customKitState.teamName =

            team.value.trim();





        const sportImages =

            kitImages[

                selectedSport

            ];





        if (

            !sportImages

        ) {



            return;



        }





        const imagePath =

            sportImages[

                view

            ];





        previewImage.src =

            imagePath;





        previewImage.alt =

            selectedSport +

            " custom team kit " +

            view +

            " view";





        [

            colourOverlay,

            secondaryOverlay,

            accentOverlay



        ].forEach(

            function (

                overlay

            ) {



                overlay.style
                    .webkitMaskImage =

                    'url("' +

                    imagePath +

                    '")';





                overlay.style

                    .maskImage =

                    'url("' +

                    imagePath +

                    '")';



            }

        );





        colourOverlay

            .style

            .background =

            primary.value;





        secondaryOverlay

            .style

            .background =

            secondary.value;





        accentOverlay

            .style

            .background =

            accent.value;





        stage.classList.remove(

            "design-velocity",

            "design-apex",

            "design-phantom"

        );





        stage.classList.add(

            "design-" +

            selectedTemplate

                .toLowerCase()

        );





        setText(

            "summarySport",

            selectedSport

        );





        setText(

            "summaryTemplate",

            selectedTemplate

        );





        setText(

            "previewTemplateName",

            selectedTemplate

        );





        if (

            summaryGarment

        ) {



            summaryGarment

                .textContent =

                selectedGarment;



        }



    }





    /* =====================================================

       OLD FUNCTION NAME BRIDGE

       ===================================================== */



    function updateGarmentShape() {



        updateKitPreview();



    }





    /* =====================================================

       APPLY VELOCITY / APEX / PHANTOM

       ===================================================== */



    function applyDesign() {



        updateKitPreview();



    }





    /* =====================================================

       FRONT / BACK BUTTONS

       ===================================================== */



    frontViewButton

        .addEventListener(

            "click",

            function () {



                frontViewButton

                    .classList.add(

                        "selected"

                    );





                backViewButton

                    .classList.remove(

                        "selected"

                    );





                updateKitPreview();



            }

        );





    backViewButton

        .addEventListener(

            "click",

            function () {



                backViewButton

                    .classList.add(

                        "selected"

                    );





                frontViewButton

                    .classList.remove(

                        "selected"

                    );





                updateKitPreview();



            }

        );





    /* =====================================================

       SELECT SPORT

       ===================================================== */



    function selectSport(

        sport

    ) {



        if (

            !garments[

                sport

            ]

        ) {



            return;



        }





        selectedSport =

            sport;





        selectedGarment =

            garments[

                sport

            ][0];





        sportButtons.forEach(

            function (button) {



                const selected =

                    button.dataset.sport ===

                    sport;





                button.classList.toggle(

                    "selected",

                    selected

                );





                button.setAttribute(

                    "aria-pressed",

                    String(

                        selected

                    )

                );



            }

        );





        updateKitPreview();



        updatePrice();



    }





    sportButtons.forEach(

        function (button) {



            button.addEventListener(

                "click",

                function () {



                    selectSport(

                        button.dataset.sport

                    );



                    advance(1);



                }

            );



        }

    );





    /* =====================================================

       SELECT TEMPLATE

       ===================================================== */



    templateCards.forEach(

        function (card) {



            card.addEventListener(

                "click",

                function () {



                    const name =

                        card.dataset.template;





                    if (

                        !Object.prototype

                            .hasOwnProperty.call(

                                designStyles,

                                name

                            )

                    ) {



                        return;



                    }





                    selectedTemplate =

                        name;





                    templateCards

                        .forEach(

                            function (

                                other

                            ) {



                                other.classList.toggle(

                                    "selected",

                                    other === card

                                );



                            }

                        );





                    applyDesign();



                    updatePrice();



                    advance(2);



                }

            );



        }

    );





    /* =====================================================

       COLOUR CONTROLS

       ===================================================== */



    [

        primary,

        secondary,

        accent



    ].forEach(

        function (input) {



            input.addEventListener(

                "input",

                function () {



                    updateColourLabels();



                    applyDesign();



                    advance(2);



                }

            );



        }

    );





    /* =====================================================

       TEAM DETAILS

       ===================================================== */



    team.addEventListener(

        "input",

        function () {



            customKitState.teamName =

                team.value.trim();



            setText(

                "previewTeamName",



                team.value

                    .trim()

                    .toUpperCase() ||

                "YOUR TEAM"

            );





            advance(3);



        }

    );





    function updateNumber() {



        if (

            !number

        ) {



            return 0;



        }





        const value =

            Number(

                number.value

            );





        const safe =

            Number.isFinite(

                value

            )

                ? Math.min(

                    99,



                    Math.max(

                        0,

                        Math.floor(

                            value

                        )

                    )

                )

                : 0;





        setText(

            "previewNumber",

            safe

        );





        return safe;



    }





    if (

        player

    ) {



        player.addEventListener(

            "input",

            function () {



                setText(

                    "previewPlayerName",



                    player.value

                        .trim()

                        .toUpperCase() ||

                    "PLAYER"

                );





                advance(3);



            }

        );



    }





    if (

        number

    ) {



        number.addEventListener(

            "input",

            function () {



                updateNumber();



                advance(3);



            }

        );





        number.addEventListener(

            "change",

            function () {



                number.value =

                    updateNumber();



            }

        );



    }





    /* =====================================================

       CREST

       ===================================================== */



    function showCrest(

        data

    ) {



        crestData =

            data || "";





        const crestPlaceholder =

            byId(

                "crestPlaceholder"

            );



        const crestImage =

            byId(

                "crestPreview"

            );





        if (

            !crestPlaceholder ||

            !crestImage

        ) {



            return;



        }





        if (

            crestData

        ) {



            crestImage.src =

                crestData;



            crestImage.style.display =

                "block";



            crestPlaceholder

                .style

                .display =

                "none";



        } else {



            crestImage

                .removeAttribute(
                    "src"

                );



            crestImage.style.display =

                "none";



            crestPlaceholder

                .style

                .display =

                "flex";



        }



    }





    if (

        crestInput

    ) {



        crestInput.addEventListener(

            "change",

            function () {



                const file =

                    crestInput.files[0];





                if (

                    !file

                ) {



                    showCrest("");



                    return;



                }





                if (

                    !file.type.startsWith(

                        "image/"

                    )

                ) {



                    alert(

                        "Please choose an image for your crest."

                    );



                    crestInput.value =

                        "";



                    return;



                }





                if (

                    file.size >

                    1024 * 1024

                ) {



                    alert(

                        "Please choose a crest smaller than 1 MB."

                    );



                    crestInput.value =

                        "";



                    return;



                }





                const reader =

                    new FileReader();





                reader.onload =

                    function () {



                        if (

                            typeof reader.result ===

                            "string"

                        ) {



                            showCrest(

                                reader.result

                            );



                            advance(3);



                        }



                    };





                reader.readAsDataURL(

                    file

                );



            }

        );



    }





    /* =====================================================

       CART COUNT

       ===================================================== */



    function updateCartCount() {



        setText(

            "cartCount",



            readArray(

                "stridexCart"

            ).reduce(

                function (

                    total,

                    item

                ) {



                    return (

                        total +

                        (

                            Number(

                                item.quantity

                            ) || 0

                        )

                    );



                },

                0

            )

        );



    }





    /* =====================================================

       SAVE DESIGN RECORD

       ===================================================== */



    function designRecord() {



        return {



            id:

                "KIT-" +

                Date.now(),



            sport:

                selectedSport,



            garment:

                selectedGarment,



            template:

                selectedTemplate,



            view:

                currentView(),



            primaryColour:

                primary.value,



            secondaryColour:

                secondary.value,



            accentColour:

                accent.value,



            teamName:

                team.value.trim(),



            playerName:

                player

                    ? player.value.trim()

                    : "",



            playerNumber:

                updateNumber(),



            crest:

                crestData,



            players:

                getRosterData(),



            sizeSummary:

                getSizeSummary(),



            size:

                size.value,



            quantity:

                quantity(),



            pricePerKit:

                unitPrice(),



            estimatedTotal:

                unitPrice() *

                quantity(),



            status:

                "Saved Design",



            createdAt:

                new Date()

                    .toISOString()



        };



    }





    /* =====================================================

       SAVE MY DESIGN

       ===================================================== */



    const saveKitButton =

        byId(

            "saveKitButton"

        );





    if (

        saveKitButton

    ) {



        saveKitButton

            .addEventListener(

                "click",

                function () {



                    const design =

                        designRecord();





                    if (

                        store(

                            "stridexSavedKit",

                            design

                        )

                    ) {



                        alert(

                            "Your kit design has been saved."

                        );



                    }



                }

            );



    }





    /* =====================================================

       REQUEST REVIEW

       ===================================================== */



    function openReview() {



        if (

            !team.value.trim()

        ) {



            alert(

                "Please enter your team name before requesting a kit."

            );



            team.focus();



            return;



        }





        const players =

            getRosterData();





        const missingSize =

            players.some(

                function (

                    rosterPlayer

                ) {



                    return (

                        !rosterPlayer.size

                    );



                }

            );





        if (

            missingSize

        ) {



            alert(

                "Please choose a size for every team member."

            );



            return;



        }





        pendingRequest =

            designRecord();





        setText(

            "reviewSport",

            pendingRequest.sport

        );



        setText(

            "reviewTemplate",

            pendingRequest.template

        );



        setText(

            "reviewTeam",

            pendingRequest.teamName

        );



        setText(

            "reviewPlayer",



            pendingRequest.players

                .length +

            (

                pendingRequest.players

                    .length === 1

                    ? " player"

                    : " players"

            )

        );



        setText(

            "reviewNumber",

            "-"

        );



        setText(

            "reviewSize",

            pendingRequest.sizeSummary

        );



        setText(

            "reviewQuantity",

            pendingRequest.quantity

        );



        setText(

            "reviewTotal",



            currency(

                pendingRequest

                    .estimatedTotal

            )

        );





        if (

            reviewGarment

        ) {



            reviewGarment.textContent =

                pendingRequest.garment;



        }





        [

            [

                "reviewPrimaryColour",

                pendingRequest

                    .primaryColour

            ],



            [

                "reviewSecondaryColour",

                pendingRequest

                    .secondaryColour

            ],



            [

                "reviewAccentColour",

                pendingRequest

                    .accentColour

            ]



        ].forEach(

            function (

                pair

            ) {



                const node =

                    byId(

                        pair[0]

                    );





                if (

                    node

                ) {



                    node.style.background =

                        pair[1];



                }



            }

        );





        if (

            reviewModal

        ) {



            reviewModal.classList.add(

                "show"

            );



            reviewModal.setAttribute(

                "aria-hidden",

                "false"

            );



            document.body

                .style

                .overflow =

                "hidden";



        }



    }





    function closeReview() {



        if (

            !reviewModal

        ) {



            return;



        }





        reviewModal.classList.remove(

            "show"

        );



        reviewModal.setAttribute(

            "aria-hidden",

            "true"

        );



        document.body.style.overflow =

            "";



    }





    const requestKitButton =

        byId(

            "requestKitButton"

        );





    if (

        requestKitButton

    ) {



        requestKitButton

            .addEventListener(

                "click",

                openReview

            );



    }





    const closeKitReview =

        byId(

            "closeKitReview"

        );





    if (

        closeKitReview

    ) {


        closeKitReview

            .addEventListener(

                "click",

                closeReview

            );



    }





    const editKitButton =

        byId(

            "editKitButton"

        );





    if (

        editKitButton

    ) {



        editKitButton

            .addEventListener(

                "click",

                closeReview

            );



    }





    if (

        reviewModal

    ) {



        reviewModal.addEventListener(

            "click",

            function (event) {



                if (

                    event.target ===

                    reviewModal

                ) {



                    closeReview();



                }



            }

        );



    }





    document.addEventListener(

        "keydown",

        function (event) {



            if (

                event.key ===

                    "Escape" &&

                reviewModal &&

                reviewModal.classList

                    .contains(

                        "show"

                    )

            ) {



                closeReview();



            }



        }

    );





    /* =====================================================

       CONFIRM KIT REQUEST

       ===================================================== */



    const confirmKitRequest =

    byId(

        "confirmKitRequest"

    );





if (

    confirmKitRequest

) {



    confirmKitRequest

        .addEventListener(

            "click",

            async function () {



                if (

                    !pendingRequest

                ) {



                    return;



                }





                confirmKitRequest.disabled =

                    true;





                try {



                    const response =

                        await fetch(

                            API_BASE +
                            "/api/custom-kits" +
                            (editOrderId ? "/" + editOrderId : ""),

                            {

                                method:
                                    editOrderId ? "PUT" : "POST",



                                credentials:

                                    "include",



                                headers: {

                                    "Content-Type":

                                        "application/json"

                                },



                                body:

                                    JSON.stringify({

                                        sport:

                                            pendingRequest.sport,



                                        garment:

                                            pendingRequest.garment,



                                        template:

                                            pendingRequest.template,



                                        primaryColour:

                                            pendingRequest.primaryColour,



                                        secondaryColour:

                                            pendingRequest.secondaryColour,



                                        accentColour:

                                            pendingRequest.accentColour,



                                        teamName:

                                            pendingRequest.teamName,



                                        crest:

                                            pendingRequest.crest ||

                                            null,



                                        players:

                                            pendingRequest.players.map(

                                                function (

                                                    rosterPlayer

                                                ) {



                                                    return {

                                                        playerName:

                                                            rosterPlayer

                                                                .playerName,



                                                        playerNumber:

                                                            rosterPlayer

                                                                .playerNumber === ""

                                                                ? null

                                                                : Number(

                                                                    rosterPlayer

                                                                        .playerNumber

                                                                ),



                                                        size:

                                                            rosterPlayer

                                                                .size

                                                    };



                                                }

                                            )

                                    })

                            }

                        );





                    if (

                        response.status ===

                        401

                    ) {



                        alert(

                            "Please log in before submitting your custom kit request."

                        );



                        window.location.href =

                            "account.html";



                        return;



                    }





                    const data =

                        await response

                            .json()

                            .catch(

                                function () {

                                    return {};

                                }

                            );





                    if (

                        !response.ok

                    ) {



                        const validationMessages =

                            data.errors

                                ? Object.values(

                                    data.errors

                                ).flat()

                                : [];





                        throw new Error(

                            validationMessages

                                .join(" ") ||



                            data.message ||



                            data.detail ||



                            "Could not submit your custom kit request."

                        );



                    }





                    const savedRequest = {

                        ...pendingRequest,



                        customKitOrderId:

                            data.customKitOrderId,



                        status:

                            data.status,



                        quantity:

                            data.quantity,



                        pricePerKit:

                            data.pricePerKit,



                        estimatedTotal:

                            data.estimatedTotal

                    };





                    store(

                        "stridexSavedKit",

                        savedRequest

                    );





                    closeReview();





                    alert(
                        editOrderId
                            ? "Custom kit request #" + data.customKitOrderId + " updated successfully."
                            : "Custom kit request #" + data.customKitOrderId + " submitted successfully."
                    );

                    const destinationOrderId =
                        editOrderId || data.customKitOrderId;

                    window.location.href =
                        "custom-kit-order.html?id=" + destinationOrderId;





                } catch (error) {



                    alert(

                        error.message ||

                        "Could not submit your custom kit request."

                    );





                } finally {



                    confirmKitRequest.disabled =

                        false;



                }



            }

        );



}



    /* =====================================================
       LOAD EXISTING CUSTOM KIT FOR EDITING
       ===================================================== */

    async function loadEditOrder() {
        if (!editOrderId) return;
        try {
            const response = await fetch(API_BASE + "/api/custom-kits/" + editOrderId, { credentials: "include" });
            if (response.status === 401) { window.location.href = "account.html?return=" + encodeURIComponent("custom-kit.xhtml?editId=" + editOrderId); return; }
            const order = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(order.message || "Could not load this custom kit request.");
            if (!order.canEdit) { alert("This custom kit request can no longer be edited."); window.location.href = "custom-kit-order.html?id=" + editOrderId; return; }
            if (garments[order.sport]) selectedSport = order.sport;
            selectedGarment = garments[selectedSport].includes(order.garment) ? order.garment : garments[selectedSport][0];
            if (Object.prototype.hasOwnProperty.call(designStyles, order.template)) selectedTemplate = order.template;
            if (/^#[0-9a-fA-F]{6}$/.test(order.primaryColour || "")) primary.value = order.primaryColour;
            if (/^#[0-9a-fA-F]{6}$/.test(order.secondaryColour || "")) secondary.value = order.secondaryColour;
            if (/^#[0-9a-fA-F]{6}$/.test(order.accentColour || "")) accent.value = order.accentColour;
            team.value = order.teamName || ""; crestData = order.crest || "";
            if (Array.isArray(order.players) && order.players.length) { teamRoster.replaceChildren(); order.players.forEach(p => teamRoster.appendChild(createRosterRow({playerName:p.playerName||"",playerNumber:p.playerNumber||"",size:p.size||""}))); }
            sportButtons.forEach(button => { const selected=button.dataset.sport===selectedSport; button.classList.toggle("selected",selected); button.setAttribute("aria-pressed",String(selected)); });
            templateCards.forEach(card => card.classList.toggle("selected",card.dataset.template===selectedTemplate));
            const requestButton=byId("requestKitButton"); if(requestButton) requestButton.textContent="Update Team Kit";
            if(confirmKitRequest) confirmKitRequest.textContent="Save Changes";
            document.title="Edit Custom Kit | StrideX Sports";
            setText("previewTemplateName",selectedTemplate); setText("summaryTemplate",selectedTemplate);
            showCrest(crestData); updateColourLabels(); updateRoster(); applyDesign(); updateKitPreview(); updatePrice();
        } catch(error) { alert(error.message || "Could not load this custom kit request."); }
    }


    /* =====================================================

       RESTORE SAVED DESIGN

       ===================================================== */



    function restoreDesign() {



        let savedDesign;





        try {



            savedDesign =

                JSON.parse(

                    localStorage

                        .getItem(

                            "stridexSavedKit"

                        ) ||

                    "null"

                );



        } catch {



            return;



        }





        if (

            !savedDesign ||

            typeof savedDesign !==

                "object"

        ) {



            return;



        }





        if (

            garments[

                savedDesign.sport

            ]

        ) {



            selectedSport =

                savedDesign.sport;



        }





        if (

            garments[

                selectedSport

            ].includes(

                savedDesign.garment

            )

        ) {



            selectedGarment =

                savedDesign.garment;



        } else {



            selectedGarment =

                garments[

                    selectedSport

                ][0];



        }





        if (

            Object.prototype

                .hasOwnProperty.call(

                    designStyles,

                    savedDesign.template

                )

        ) {



            selectedTemplate =

                savedDesign.template;



        }





        [

            "primaryColour",

            "secondaryColour",

            "accentColour"



        ].forEach(

            function (id) {



                const value =

                    savedDesign[

                        id

                    ];





                if (

                    typeof value ===

                        "string" &&

                    /^#[0-9a-fA-F]{6}$/

                        .test(

                            value

                        )

                ) {



                    byId(id).value =

                        value;



                }



            }

        );





        team.value =

            savedDesign.teamName ||

            "";





        if (

            player

        ) {



            player.value =

                savedDesign.playerName ||

                "";



        }





        if (

            number

        ) {



            number.value =

                savedDesign.playerNumber ??

                10;



        }





        crestData =

            savedDesign.crest ||

            "";





        if (

            Array.isArray(

                savedDesign.players

            ) &&

            savedDesign.players.length > 0

        ) {



            teamRoster

                .replaceChildren();





            savedDesign.players

                .forEach(

                    function (

                        rosterPlayer

                    ) {



                        teamRoster

                            .appendChild(

                                createRosterRow(

                                    rosterPlayer

                                )

                            );



                    }

                );



        }





        if (

            savedDesign.view ===

            "back"

        ) {



            backViewButton

                .classList.add(

                    "selected"

                );



            frontViewButton

                .classList.remove(

                    "selected"

                );


        } else {



            frontViewButton

                .classList.add(

                    "selected"

                );



            backViewButton

                .classList.remove(

                    "selected"

                );



        }



    }





    /* =====================================================

       START KITLAB

       ===================================================== */



    restoreDesign();

    loadEditOrder();





    sportButtons.forEach(

        function (button) {



            const selected =

                button.dataset.sport ===

                selectedSport;





            button.classList.toggle(

                "selected",

                selected

            );





            button.setAttribute(

                "aria-pressed",

                String(

                    selected

                )

            );



        }

    );





    templateCards.forEach(

        function (card) {



            card.classList.toggle(

                "selected",



                card.dataset.template ===

                selectedTemplate

            );



        }

    );





    setText(

        "previewTemplateName",

        selectedTemplate

    );





    setText(

        "summaryTemplate",

        selectedTemplate

    );





    setText(

        "previewTeamName",



        team.value

            .trim()

            .toUpperCase() ||

        "YOUR TEAM"

    );





    if (

        player

    ) {



        setText(

            "previewPlayerName",



            player.value

                .trim()

                .toUpperCase() ||

            "PLAYER"

        );



    }





    updateNumber();



    showCrest(

        crestData

    );



    updateColourLabels();



    updateRoster();



    updateKitPreview();



    updatePrice();



    updateCartCount();





    if (

        reviewModal

    ) {



        reviewModal.setAttribute(

            "aria-hidden",

            "true"

        );



    }



});