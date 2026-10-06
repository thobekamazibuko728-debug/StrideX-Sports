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


