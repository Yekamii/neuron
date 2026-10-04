/* =====================================================
   ნეირონის სტრუქტურის მინი თამაში
===================================================== */


/* =====================================================
   მონაცემები
===================================================== */

const structures = [
    {
        id: "dendrite",

        name: "დენდრიტი",

        function:
            "იღებს სიგნალებს სხვა უჯრედებიდან და გადასცემს მათ ნეირონის სხეულისკენ."
    },

    {
        id: "soma",

        name: "სხეული (სომა)",

        function:
            "უზრუნველყოფს ნეირონის ძირითად სასიცოცხლო პროცესებს და აერთიანებს მიღებულ ინფორმაციას."
    },

    {
        id: "axon",

        name: "აქსონი",

        function:
            "ნერვული ინპულსი გამოაქვს ნეირონის სხეულიდან."
    },

    {
        id: "myelin",

        name: "მიელინის გარსი",

        function:
            "იზოლაციას უკეთებს აქსონს და ხელს უწყობს ნერვული იმპულსის სწრაფ გავრცელებას."
    },

    {
        id: "axon-endings",

        name: "აქსონის დაბოლოებები",

        function:
            "გადასცემს სიგნალს შემდეგ უჯრედს ნეიროტრანსმიტერების გამოყოფით."
    }
];


/* =====================================================
   ელემენტები
===================================================== */

const cardsContainer =
    document.getElementById("cardsContainer");

const progressText =
    document.getElementById("progressText");

const phaseNumber =
    document.getElementById("phaseNumber");

const cardsTitle =
    document.getElementById("cardsTitle");

const cardsDescription =
    document.getElementById("cardsDescription");

const finishBox =
    document.getElementById("finishBox");

const restartButton =
    document.getElementById("restartButton");

const message =
    document.getElementById("message");

const dropZones =
    document.querySelectorAll(".drop-zone");


/* =====================================================
   მდგომარეობა
===================================================== */

let currentPhase = 1;

let correctStructures = 0;

let correctFunctions = 0;

let activeCard = null;

let offsetX = 0;

let offsetY = 0;


/* =====================================================
   შემთხვევითი არევა
===================================================== */

function shuffle(array) {

    const shuffled = [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const random =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffled[i],
            shuffled[random]
        ] =
        [
            shuffled[random],
            shuffled[i]
        ];
    }

    return shuffled;
}


/* =====================================================
   სტრუქტურების ბარათები
===================================================== */

function createStructureCards() {

    cardsContainer.innerHTML = "";

    const shuffled =
        shuffle(structures);

    shuffled.forEach((structure) => {

        const card =
            document.createElement("div");

        card.className =
            "drag-card";

        card.dataset.type =
            "structure";

        card.dataset.answer =
            structure.id;

        card.textContent =
            structure.name;

        cardsContainer.appendChild(card);

        enableDragging(card);
    });
}


/* =====================================================
   ფუნქციების ბარათები
===================================================== */

function createFunctionCards() {

    cardsContainer.innerHTML = "";

    const shuffled =
        shuffle(structures);

    shuffled.forEach((structure) => {

        const card =
            document.createElement("div");

        card.className =
            "drag-card function-card";

        card.dataset.type =
            "function";

        card.dataset.answer =
            structure.id;

        card.textContent =
            structure.function;

        cardsContainer.appendChild(card);

        enableDragging(card);
    });
}


/* =====================================================
   Drag & Drop
===================================================== */

function enableDragging(card) {

    card.addEventListener(
        "pointerdown",
        startDragging
    );
}


/* =====================================================
   ბარათის დაჭერა
===================================================== */

function startDragging(event) {

    if (
        this.classList.contains(
            "correct-card"
        )
    ) {

        return;
    }

    activeCard = this;

    const rect =
        activeCard.getBoundingClientRect();

    offsetX =
        event.clientX -
        rect.left;

    offsetY =
        event.clientY -
        rect.top;

    activeCard.classList.add(
        "dragging"
    );

    activeCard.style.width =
        rect.width + "px";

    activeCard.style.left =
        rect.left + "px";

    activeCard.style.top =
        rect.top + "px";

    document.body.style.userSelect =
        "none";

    activeCard.setPointerCapture(
        event.pointerId
    );

    activeCard.addEventListener(
        "pointermove",
        dragMove
    );

    activeCard.addEventListener(
        "pointerup",
        stopDragging,
        {
            once: true
        }
    );
}


/* =====================================================
   ბარათის მოძრაობა
===================================================== */

function dragMove(event) {

    if (!activeCard) {

        return;
    }

    activeCard.style.left =
        (
            event.clientX -
            offsetX
        ) + "px";

    activeCard.style.top =
        (
            event.clientY -
            offsetY
        ) + "px";

    highlightDropZone(
        event.clientX,
        event.clientY
    );
}


/* =====================================================
   ბარათის გაშვება
===================================================== */

function stopDragging(event) {

    if (!activeCard) {

        return;
    }

    activeCard.removeEventListener(
        "pointermove",
        dragMove
    );

    clearHighlights();

    const target =
        findDropZone(
            event.clientX,
            event.clientY
        );

    if (target) {

        checkAnswer(
            activeCard,
            target
        );

    } else {

        returnCard(
            activeCard
        );
    }

    document.body.style.userSelect =
        "";

    activeCard =
        null;
}


/* =====================================================
   Drop Zone-ის პოვნა
===================================================== */

function findDropZone(x, y) {

    let found = null;

    dropZones.forEach((zone) => {

        const rect =
            zone.getBoundingClientRect();

        if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        ) {

            found = zone;
        }
    });

    return found;
}


/* =====================================================
   Drop Zone-ის განათება
===================================================== */

function highlightDropZone(x, y) {

    clearHighlights();

    const zone =
        findDropZone(x, y);

    if (!zone) {

        return;
    }

    if (
        zone.classList.contains(
            "function-correct"
        )
    ) {

        return;
    }

    if (
        currentPhase === 1 &&
        zone.dataset.filled === "true"
    ) {

        return;
    }

    zone.classList.add(
        "hover"
    );
}


/* =====================================================
   განათების გასუფთავება
===================================================== */

function clearHighlights() {

    dropZones.forEach((zone) => {

        zone.classList.remove(
            "hover"
        );

    });
}


/* =====================================================
   პასუხის შემოწმება
===================================================== */

function checkAnswer(
    card,
    zone
) {

    if (
        zone.classList.contains(
            "function-correct"
        )
    ) {

        returnCard(card);

        showMessage(
            "ეს სტრუქტურა უკვე დასრულებულია."
        );

        return;
    }


    if (
        currentPhase === 1 &&
        zone.dataset.filled === "true"
    ) {

        returnCard(card);

        showMessage(
            "ეს სტრუქტურა უკვე შევსებულია."
        );

        return;
    }


    const answer =
        card.dataset.answer;

    const target =
        zone.dataset.target;


    if (answer === target) {

        correctAnswer(
            card,
            zone
        );

    } else {

        wrongAnswer(
            card
        );
    }
}


/* =====================================================
   სწორი პასუხი
===================================================== */

function correctAnswer(
    card,
    zone
) {

    /* ============================================
       ეტაპი 1 — სტრუქტურები
       ============================================ */

    if (
        currentPhase === 1
    ) {

        zone.classList.add(
            "correct"
        );

        zone.dataset.filled =
            "true";


        /*
         * სწორი სტრუქტურის დასახელება
         * იწერება ზუსტად იმ უჯრაში,
         * რომელშიც ბარათი ჩავსვით,
         * და რჩება იქ.
         */

        zone.parentNode.appendChild(
            createSvgText(
                zone,
                card.textContent
            )
        );


        card.classList.add(
            "correct-card"
        );


        correctStructures++;

        updateProgress();


        showMessage(
            "სწორია!"
        );


        if (
            correctStructures ===
            structures.length
        ) {

            setTimeout(
                startFunctionPhase,
                700
            );
        }

        return;
    }


    /* ============================================
       ეტაპი 2 — ფუნქციები
       ============================================ */

    if (
        currentPhase === 2
    ) {

        card.classList.add(
            "correct-card"
        );


        /*
         * მხოლოდ უჯრა ხდება მწვანე.
         * დამატებითი ✓ აღარ იქმნება.
         */

        zone.classList.add(
            "function-correct"
        );


        correctFunctions++;

        updateProgress();


        showMessage(
            "სწორია! ფუნქცია სწორ სტრუქტურას მიაკუთვნე."
        );


        if (
            correctFunctions ===
            structures.length
        ) {

            setTimeout(
                finishGame,
                700
            );
        }
    }
}


/* =====================================================
   SVG სტრუქტურის ტექსტი
===================================================== */

function createSvgText(
    zone,
    text
) {

    const svg =
        document.querySelector(
            ".neuron-svg"
        );


    const svgText =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


    const x =
        Number(
            zone.getAttribute("x")
        );


    const y =
        Number(
            zone.getAttribute("y")
        );


    const width =
        Number(
            zone.getAttribute("width")
        );


    const height =
        Number(
            zone.getAttribute("height")
        );


    svgText.setAttribute(
        "x",
        x + width / 2
    );


    svgText.setAttribute(
        "y",
        y + height / 2 + 5
    );


    svgText.setAttribute(
        "text-anchor",
        "middle"
    );


    svgText.setAttribute(
        "font-size",
        "11"
    );


    svgText.setAttribute(
        "font-weight",
        "700"
    );


    svgText.setAttribute(
        "fill",
        "#f1f1ed"
    );


    svgText.classList.add(
        "filled-label"
    );


    svgText.textContent =
        text;


    svg.appendChild(
        svgText
    );


    return svgText;
}


/* =====================================================
   არასწორი პასუხი
===================================================== */

function wrongAnswer(card) {

    card.classList.add(
        "wrong-card"
    );


    showMessage(
        "არასწორი შესაბამისობა — სცადე თავიდან."
    );


    setTimeout(() => {

        card.classList.remove(
            "wrong-card"
        );


        returnCard(
            card
        );

    }, 500);
}


/* =====================================================
   ბარათის უკან დაბრუნება
===================================================== */

function returnCard(card) {

    card.style.left =
        "";

    card.style.top =
        "";

    card.style.width =
        "";

    card.classList.remove(
        "dragging"
    );
}


/* =====================================================
   პროგრესი
===================================================== */

function updateProgress() {

    if (
        currentPhase === 1
    ) {

        progressText.textContent =
            correctStructures +
            " / " +
            structures.length;

    } else {

        progressText.textContent =
            correctFunctions +
            " / " +
            structures.length;
    }
}


/* =====================================================
   მეორე ეტაპი — ფუნქციები
===================================================== */

function startFunctionPhase() {

    currentPhase = 2;

    correctFunctions = 0;


    phaseNumber.textContent =
        "ეტაპი 2";


    cardsTitle.textContent =
        "სტრუქტურების ფუნქციები";


    cardsDescription.textContent =
        "ახლა თითოეული ფუნქცია მიიტანე იმ სტრუქტურასთან, რომელსაც ეკუთვნის.";


    progressText.textContent =
        "0 / " +
        structures.length;


    dropZones.forEach((zone) => {

        zone.classList.remove(
            "function-correct"
        );

    });


    /*
     * ფუნქციის მწვანე ✓ აღარ იშლება/იქმნება,
     * რადგან საერთოდ აღარ გამოიყენება.
     */


    createFunctionCards();
}


/* =====================================================
   თამაშის დასრულება
===================================================== */

function finishGame() {

    cardsTitle.textContent =
        "თამაში დასრულებულია";


    cardsDescription.textContent =
        "ყველა სტრუქტურა და ფუნქცია სწორად შეუსაბამე.";


    finishBox.classList.add(
        "show"
    );


    showMessage(
        "🎉 შესანიშნავია! ყველა პასუხი სწორია."
    );
}


/* =====================================================
   შეტყობინება
===================================================== */

function showMessage(text) {

    message.textContent =
        text;


    message.classList.add(
        "show"
    );


    setTimeout(() => {

        message.classList.remove(
            "show"
        );

    }, 1300);
}


/* =====================================================
   თავიდან დაწყება
===================================================== */

restartButton.addEventListener(
    "click",
    restartGame
);


function restartGame() {

    currentPhase = 1;


    correctStructures = 0;


    correctFunctions = 0;


    activeCard = null;


    finishBox.classList.remove(
        "show"
    );


    phaseNumber.textContent =
        "ეტაპი 1";


    cardsTitle.textContent =
        "სტრუქტურები";


    cardsDescription.textContent =
        "გადაიტანე თითოეული დასახელება სწორ უჯრაში.";


    progressText.textContent =
        "0 / " +
        structures.length;


    dropZones.forEach((zone) => {

        zone.classList.remove(
            "correct",
            "hover",
            "function-correct"
        );


        delete zone.dataset.filled;

    });


    document
        .querySelectorAll(
            ".filled-label"
        )
        .forEach((label) => {

            label.remove();

        });


    /*
     * function-success-mark აღარ გამოიყენება.
     */


    message.classList.remove(
        "show"
    );


    message.textContent =
        "";


    createStructureCards();
}


/* =====================================================
   პირველი გაშვება
===================================================== */

createStructureCards();