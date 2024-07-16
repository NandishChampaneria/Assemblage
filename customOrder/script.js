document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("pattern-canvas");
    const ctx = canvas.getContext("2d");
    const stringSelect = document.getElementById("string-select");
    const backgroundColorPicker = document.getElementById("background-color-picker");
    const upperVColorPicker = document.getElementById("upper-v-color-picker");
    const lowerVColorPicker = document.getElementById("lower-v-color-picker");
    const threeColor = document.getElementById("3-color-picker");



    // Function to draw pattern based on string model
    function drawPattern() {
        const stringModel = stringSelect.value;
        const backgroundColor = backgroundColorPicker.value;
        const upperVColor = upperVColorPicker.value;
        const lowerVColor = lowerVColorPicker.value;
        const thirdVColor = threeColor.value;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (stringModel === "4-string") {
            draw4StringPattern(upperVColor);
        } else if (stringModel === "6-string") {
            draw6StringPattern(upperVColor, lowerVColor);
        } else if (stringModel === "8-string") {
            draw8StringPattern(upperVColor, lowerVColor, thirdVColor);
        }
    }

    // Function to draw 4-string pattern
    function draw4StringPattern(color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 13; // Adjust line width as needed
        
        // Decrease canvas width from both sides
        const canvasWidth = canvas.width - 130; // Adjust the amount to decrease

        ctx.beginPath();
        const chevronWidth = 150;
        const chevronHeight = 70;
        let spaceBetween = (canvas.height - (chevronHeight * 10)) / 9; // Calculate space between chevrons dynamically

        for (let i = -5; i < 15; i++) { // Extend the loop range to cover off-canvas V shapes
            const startY = i * (chevronHeight + spaceBetween);
            const startX = (canvas.width - canvasWidth) / 2 - chevronWidth / 2; // Adjust the starting point
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + chevronWidth / 2, startY + chevronHeight);
            ctx.lineTo(startX + chevronWidth, startY);
        }
        ctx.stroke();
    }

    // Function to draw 6-string pattern
    function draw6StringPattern(upperColor, lowerColor) {
        // Drawing the first loop with adjusted spacing
        ctx.strokeStyle = upperColor; // Set the color for the first loop
        ctx.lineWidth = 13; // Adjust line width as needed
        const canvasWidth = canvas.width - 130; // Decrease canvas width from both sides
        const chevronWidth = 150;
        const chevronHeight = 70;
        let spaceBetween = (canvas.height - (chevronHeight * 10)) / 18; // Calculate space between chevrons dynamically and double it

        for (let i = -5; i < 15; i++) { // Extend the loop range to cover off-canvas V shapes
            const startY = i * (chevronHeight + spaceBetween);
            const startX = (canvas.width - canvasWidth) / 2 - chevronWidth / 2; // Adjust the starting point
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + chevronWidth / 2, startY + chevronHeight);
            ctx.lineTo(startX + chevronWidth, startY);
            ctx.stroke();
        }

        // Drawing the second loop
        ctx.strokeStyle = lowerColor; // Set the color for the second loop
        const startYSecond = (canvas.height / 2) + 20; // Adjust the starting Y position for the second loop
        for (let i = -5; i < 15; i++) { // Extend the loop range to cover off-canvas V shapes
            const startY = startYSecond + i * (chevronHeight + spaceBetween) + 10; // Adjust the starting Y position for the second loop
            const startX = (canvas.width - canvasWidth) / 2 - chevronWidth / 2; // Adjust the starting point
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + chevronWidth / 2, startY + chevronHeight);
            ctx.lineTo(startX + chevronWidth, startY);
            ctx.stroke();
        }
    }

    // Function to draw 8-string pattern
    function draw8StringPattern(upperColor, lowerColor, thirdColor) {
        // Drawing the first loop with adjusted spacing
        ctx.strokeStyle = upperColor; // Set the color for the first loop
        ctx.lineWidth = 13; // Adjust line width as needed
        const canvasWidth = canvas.width - 130; // Decrease canvas width from both sides
        const chevronWidth = 150;
        const chevronHeight = 70;
        let spaceBetween = (canvas.height - (chevronHeight * 10)) / 36; // Calculate space between chevrons dynamically and double it

        for (let i = -5; i < 15; i++) { // Extend the loop range to cover off-canvas V shapes
            const startY = i * (chevronHeight + spaceBetween);
            const startX = (canvas.width - canvasWidth) / 2 - chevronWidth / 2; // Adjust the starting point
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + chevronWidth / 2, startY + chevronHeight);
            ctx.lineTo(startX + chevronWidth, startY);
            ctx.stroke();
        }

        // Drawing the second loop
        ctx.strokeStyle = lowerColor; // Set the color for the second loop
        const startYSecond = (canvas.height / 2) + 20; // Adjust the starting Y position for the second loop
        for (let i = -5; i < 15; i++) { // Extend the loop range to cover off-canvas V shapes
            const startY = startYSecond + i * (chevronHeight + spaceBetween) + 10; // Adjust the starting Y position for the second loop
            const startX = (canvas.width - canvasWidth) / 2 - chevronWidth / 2; // Adjust the starting point
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + chevronWidth / 2, startY + chevronHeight);
            ctx.lineTo(startX + chevronWidth, startY);
            ctx.stroke();
        }

        // Drawing the third loop
        ctx.strokeStyle = thirdColor; // Set the color for the third loop
        const startYThird = (canvas.height / 2) + 40; // Adjust the starting Y position for the third loop
        for (let i = -5; i < 15; i++) { // Extend the loop range to cover off-canvas V shapes
            const startY = startYThird + i * (chevronHeight + spaceBetween) + 20; // Adjust the starting Y position for the third loop
            const startX = (canvas.width - canvasWidth) / 2 - chevronWidth / 2; // Adjust the starting point
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + chevronWidth / 2, startY + chevronHeight);
            ctx.lineTo(startX + chevronWidth, startY);
            ctx.stroke();
        }
    }

    // Event listeners
    stringSelect.addEventListener("change", drawPattern);
    backgroundColorPicker.addEventListener("change", drawPattern);
    upperVColorPicker.addEventListener("change", drawPattern);
    lowerVColorPicker.addEventListener("change", drawPattern);
    threeColor.addEventListener("change", drawPattern);


    // Initial drawing
    drawPattern();
});




