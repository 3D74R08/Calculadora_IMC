document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del DOM
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButton');
    const helpButton = document.getElementById('helpButton');
    const imcForm = document.getElementById('imcForm');
    const resultContainer = document.getElementById('resultContainer');
    const imcValue = document.getElementById('imcValue');
    const imcCategory = document.getElementById('imcCategory');
    const historyList = document.getElementById('historyList');
    const spinner = document.querySelector('.spinner-border');
    
    // Configurar el modal de ayuda
    const helpModal = new bootstrap.Modal(document.getElementById('helpModal'));
    
    // Mostrar el modal de ayuda
    helpButton.addEventListener('click', function() {
        helpModal.show();
    });
    
    // Calcular IMC
    calculateButton.addEventListener('click', function() {
        // Validar entradas
        let isValid = true;
        
        // Validar peso
        if (!weightInput.value || weightInput.value <= 0) {
            weightInput.classList.add('is-invalid');
            isValid = false;
        } else {
            weightInput.classList.remove('is-invalid');
        }
        
        // Validar altura
        if (!heightInput.value || heightInput.value <= 0) {
            heightInput.classList.add('is-invalid');
            isValid = false;
        } else {
            heightInput.classList.remove('is-invalid');
        }
        
        if (isValid) {
            // Mostrar el spinner
            spinner.style.display = 'inline-block';
            calculateButton.disabled = true;
            
            // Simular la llamada a la API
            setTimeout(function() {
                const weight = parseFloat(weightInput.value);
                const height = parseFloat(heightInput.value) / 100; // Convertir cm a metros
                
                // Calcular IMC
                const imc = weight / (height * height);
                const imcRounded = Math.round(imc * 10) / 10;
                
                // Mostrar el resultado
                imcValue.textContent = imcRounded.toFixed(1);
                
                // Determinar la categoría
                let category, categoryClass;
                if (imc < 18.5) {
                    category = "Bajo Peso";
                    categoryClass = "category-underweight";
                } else if (imc < 25) {
                    category = "Peso Normal";
                    categoryClass = "category-normal";
                } else if (imc < 30) {
                    category = "Sobrepeso";
                    categoryClass = "category-overweight";
                } else {
                    category = "Obesidad";
                    categoryClass = "category-obese";
                }
                
                imcCategory.textContent = category;
                imcCategory.className = `result-category ${categoryClass}`;
                
                // Guardar en el historial (LocalStorage)
                saveToHistory(weight, height, imcRounded, category);
                
                // Actualizar la lista de historial
                updateHistoryList();
                
                // Mostrar el contenedor de resultados y ocultar el formulario
                imcForm.style.display = 'none';
                resultContainer.style.display = 'block';
                
                // Ocultar el spinner
                spinner.style.display = 'none';
                calculateButton.disabled = false;
            }, 1500); // Simular tiempo de respuesta
        }
    });
    
    // Reiniciar el formulario
    resetButton.addEventListener('click', function() {
        imcForm.style.display = 'block';
        resultContainer.style.display = 'none';
        weightInput.value = '';
        heightInput.value = '';
    });
    
    // Guardar en el historial
    function saveToHistory(weight, height, imc, category) {
        // Obtener el historial actual o crear uno nuevo
        let history = JSON.parse(localStorage.getItem('imcHistory')) || [];
        
        // Agregar el nuevo cálculo
        const newEntry = {
            weight: weight,
            height: height,
            imc: imc,
            category: category,
            date: new Date().toISOString()
        };
        
        // Agregar al inicio del array
        history.unshift(newEntry);
        
        // Mantener solo los últimos 5 cálculos
        if (history.length > 5) {
            history = history.slice(0, 5);
        }
        
        // Guardar en localStorage
        localStorage.setItem('imcHistory', JSON.stringify(history));
    }
    
    // Actualizar la lista de historial
    function updateHistoryList() {
        // Obtener el historial
        const history = JSON.parse(localStorage.getItem('imcHistory')) || [];
        
        // Limpiar la lista actual
        historyList.innerHTML = '';
        
        // Si no hay historial, mostrar un mensaje
        if (history.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'history-item';
            emptyItem.textContent = 'No hay cálculos previos';
            historyList.appendChild(emptyItem);
            return;
        }
        
        // Agregar cada entrada a la lista
        history.forEach(function(entry) {
            const item = document.createElement('li');
            item.className = 'history-item';
            
            // Crear el contenido del item
            const infoDiv = document.createElement('div');
            
            const imcSpan = document.createElement('strong');
            imcSpan.textContent = `IMC: ${entry.imc.toFixed(1)}`;
            
            const categorySpan = document.createElement('span');
            categorySpan.textContent = ` - ${entry.category}`;
            categorySpan.style.marginLeft = '10px';
            
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'small text-muted';
            detailsDiv.textContent = `Peso: ${entry.weight} kg, Altura: ${(entry.height * 100).toFixed(0)} cm`;
            
            infoDiv.appendChild(imcSpan);
            infoDiv.appendChild(categorySpan);
            infoDiv.appendChild(detailsDiv);
            
            // Crear la fecha
            const dateDiv = document.createElement('div');
            dateDiv.className = 'history-date';
            
            // Formatear la fecha con moment.js
            const formattedDate = moment(entry.date).locale('es').format('DD MMM YYYY, HH:mm');
            dateDiv.textContent = formattedDate;
            
            // Agregar todo al item
            item.appendChild(infoDiv);
            item.appendChild(dateDiv);
            
            // Agregar el item a la lista
            historyList.appendChild(item);
        });
    }
    
    // Cargar el historial al iniciar
    updateHistoryList();
});