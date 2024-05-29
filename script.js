let items = [];
let totalWeight = 0;
let isSpinning = false;
let isSettingsVisible = false;

// Add item to the list
function addItem() {
    if (isSpinning) return;

    const item = document.getElementById('item').value;
    const weight = parseInt(document.getElementById('weight').value);

    if (item && weight > 0 && weight <= 100) {
        items.push({ name: item, weight: weight });
        totalWeight += weight;

        const listItem = createListItem(item, weight);
        document.getElementById('itemList').appendChild(listItem);

        drawWheel();
    } else {
        alert('ห้ามเลือกโอกาสเกิน 100');
    }
}

// Create list item element with update and remove functionalities
function createListItem(item, weight) {
    const listItem = document.createElement('li');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = item;
    listItem.appendChild(nameInput);

    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.value = weight;
    listItem.appendChild(weightInput);

    const updateButton = document.createElement('button');
    updateButton.textContent = 'แก้ไข';
    updateButton.onclick = () => updateItem(item, nameInput.value, weightInput.value);
    listItem.appendChild(updateButton);

    const removeButton = document.createElement('span');
    removeButton.textContent = 'ลบ';
    removeButton.classList.add('remove-button');
    removeButton.onclick = () => removeItem(item, weight, listItem);
    listItem.appendChild(removeButton);

    return listItem;
}

// Update item details
function updateItem(oldName, newName, newWeight) {
    if (isSpinning) return;

    newWeight = parseInt(newWeight);

    if (newName && newWeight > 0 && newWeight <= 100) {
        const index = items.findIndex(i => i.name === oldName);
        if (index !== -1) {
            totalWeight -= items[index].weight;
            items[index].name = newName;
            items[index].weight = newWeight;
            totalWeight += newWeight;
            drawWheel();
        }
    } else {
        alert('ห้ามเลือกโอกาสเกิน 100');
    }
}

// Remove item from the list
function removeItem(item, weight, listItem) {
    if (isSpinning) return;
    items = items.filter(i => i.name !== item);
    totalWeight -= weight;
    listItem.remove();
    drawWheel();
}

// Reset all items and wheel
function reset() {
    if (isSpinning) return;
    items = [];
    totalWeight = 0;
    document.getElementById('itemList').innerHTML = '';
    drawWheel();
}

// Draw the wheel with current items and weights
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const numItems = items.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startAngle = 0;

    items.forEach(item => {
        const sliceAngle = 2 * Math.PI * (item.weight / totalWeight);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.fillStyle = getRandomColor();
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        const textAngle = startAngle + sliceAngle / 2;
        ctx.save();
        ctx.translate(centerX + Math.cos(textAngle) * (radius / 2), centerY + Math.sin(textAngle) * (radius / 2));
        ctx.rotate(textAngle + Math.PI / 2);
        ctx.fillStyle = 'white';
        ctx.fillText(item.name, -ctx.measureText(item.name).width / 2, 0);
        ctx.restore();

        startAngle += sliceAngle;
    });
}

// Generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Spin the wheel and determine the winner
function spin() {
    if (isSpinning) return;
    isSpinning = true;

    const canvas = document.getElementById('wheelCanvas');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let randomAngle = Math.random() * 2 * Math.PI;
    const spinAngle = 20 * 2 * Math.PI + randomAngle;

    canvas.style.transition = 'none';
    canvas.style.transform = `rotate(0rad)`;

    setTimeout(() => {
        canvas.style.transition = 'transform 12s ease-in-out';
        canvas.style.transform = `rotate(${spinAngle}rad)`;
    }, 50);

    setTimeout(() => {
        const selectedAngle = (2 * Math.PI - randomAngle) % (2 * Math.PI);
        let startAngle = 0;
        for (let i = 0; i < items.length; i++) {
            const sliceAngle = 2 * Math.PI * (items[i].weight / totalWeight);
            if (selectedAngle >= startAngle && selectedAngle <= startAngle + sliceAngle) {
                showResult(items[i].name);
                break;
            }
            startAngle += sliceAngle;
        }
        isSpinning = false;
    }, 12050);
}

// Display the result of the spin
function showResult(wonItem) {
    const resultText = document.getElementById('resultText');
    const resultContainer = document.getElementById('result');
    if (wonItem !== '') {
        resultText.innerHTML = `<br><br>ยินดีด้วย 🎉 คุณได้รับ<br><br>${wonItem}`;
        resultContainer.style.display = 'block';
    } else {
        resultContainer.style.display = 'none';
    }
}

// Hide the result display
function hideResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'none';
}

// Toggle settings visibility
function showSettings() {
    const settingsDiv = document.getElementById('settings');
    isSettingsVisible = !isSettingsVisible;
    settingsDiv.style.display = isSettingsVisible ? 'block' : 'none';
}
