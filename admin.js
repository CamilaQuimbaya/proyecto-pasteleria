document.addEventListener('DOMContentLoaded', function(){
    let addButton = document.getElementById('addButton');
    let cakeInputName = document.getElementById('cakeInputName');
    let cakeInputDescription = document.getElementById('cakeInputDescription');
    let cakeInputPrice = document.getElementById('cakeInputPrice');
    let cakeInputImage = document.getElementById('cakeInputImage');
    let saveButton = document.getElementById('saveButton');
    let searchInput = document.getElementById('searchInput');

    addButton.addEventListener('click', function(){
        addButton.style.display = 'none';
        cakeInputName.style.display = 'block';
        cakeInputDescription.style.display = 'block';
        cakeInputPrice.style.display = 'block';
        cakeInputImage.style.display = 'block';
        saveButton.style.display = 'block';
    })


    saveButton.addEventListener('click', function(){
        addOrUpdateCake();
    })


    loadCakes();

    searchInput.addEventListener('input', function(){
        let searchValue = searchInput.value.trim().toLowerCase();
        console.log(searchValue);
        let cakes = JSON.parse(localStorage.getItem('cakes')) || [];
        let filteredCakes = cakes.filter(function(cake){
            return cake.name.toLowerCase().includes(searchValue) || cake.description.toLowerCase().includes(searchValue);
        })
        renderCakes(filteredCakes)
    })
});

function addOrUpdateCake(){
    console.log('guardando cake');
    let cakeInputNameValue = document.getElementById('cakeInputName').value.trim();
    let cakeInputDescriptionValue = document.getElementById('cakeInputDescription').value.trim();
    let cakeInputPriceValue = document.getElementById('cakeInputPrice').value.trim();
    let cakeInputImageValue = document.getElementById('cakeInputImage').value.trim();

    if(cakeInputNameValue !== '' && cakeInputDescriptionValue !== '' && cakeInputPriceValue !== '' && cakeInputImageValue !== ''){
         let cakes =  JSON.parse(localStorage.getItem('cakes')) || [];
         let cakeIndexElement = document.getElementById('cakeIndex');


         let cakeIndex = cakeIndexElement && !isNaN(parseInt(cakeIndexElement.value)) ? parseInt(cakeIndexElement.value) : -1;

         console.log(cakeIndex);
         if(!isNaN(cakeIndex) && cakeIndex >= 0 && cakeIndex < cakes.length){
            console.log('actualizando cake');
             cakes[cakeIndex] = {
                 name: cakeInputNameValue,
                 description: cakeInputDescriptionValue,
                 price: cakeInputPriceValue,
                 image: cakeInputImageValue,
                 stock: cakes[cakeIndex].stock
             }
        }else{
            cakes.push({
                name: cakeInputNameValue,
                description: cakeInputDescriptionValue,
                price: cakeInputPriceValue,
                image: cakeInputImageValue,
                stock: false
            });
        }

        localStorage.setItem('cakes', JSON.stringify(cakes));

        loadCakes();

        document.getElementById('cakeInputName').value = '';
        document.getElementById('cakeInputDescription').value = '';
        document.getElementById('cakeInputPrice').value = '';
        document.getElementById('cakeInputImage').value = '';

        document.getElementById('cakeInputName').style.display = 'none';
        document.getElementById('cakeInputDescription').style.display = 'none';
        document.getElementById('cakeInputPrice').style.display = 'none';
        document.getElementById('cakeInputImage').style.display = 'none';
        document.getElementById('saveButton').style.display = 'none';
        document.getElementById('addButton').style.display = 'block';

        if(cakeIndexElement){
            cakeIndexElement.value = '';
        }

    }else{
        alert('Please fill all the fields');
    }

}

function loadCakes(){
    let cakes = JSON.parse(localStorage.getItem('cakes')) || [];
    console.log(cakes);
    renderCakes(cakes);
}


function renderCakes(cakes){
    let cakesContainer = document.getElementById('cakesContainer');
    cakesContainer.innerHTML = '';

    let cakeSold = 0;

    cakes.forEach(function(cake, index){
        let cakeElement = createCakeElement(cake, index);
        cakesContainer.appendChild(cakeElement);
        if(cake.stock){
            cakeSold++;
        }
    })
}

function createCakeElement(cake, index){
    let cakeElement = document.createElement('div');
    cakeElement.className = 'col-lg-4 col-md-6 col-sm-12 note'

    let checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'checkbox-wrapper';

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'cb-' + index;
    checkbox.checked = cake.stock;

    checkbox.addEventListener('change', function(){
        toggledStock(index);
    })

    let label = document.createElement('label');
    label.classList.add('check-box')
    label.setAttribute('for', 'cb-' + index);


    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(label);

    let img = document.createElement('img');
    img.src = cake.image;
    img.width = 200;
    img.className = 'img-fluid';
    img.alt = cake.name;
    let name = document.createElement('h3');
    name.textContent = cake.name;
    let description = document.createElement('p');
    description.textContent = cake.description;
    let price = document.createElement('p');
    price.textContent = `$${cake.price}`;

    cakeElement.appendChild(checkboxWrapper);
    cakeElement.appendChild(img);
    cakeElement.appendChild(name);
    cakeElement.appendChild(description);
    cakeElement.appendChild(price);

    let editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function(){
        editCake(index);
    })

    cakeElement.appendChild(editButton);

    let deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function(){
        deleteCakeElement(index);
    })

    cakeElement.appendChild(deleteButton);


    return cakeElement;

}


function editCake(index){
    let cakes = JSON.parse(localStorage.getItem('cakes')) || [];
    if(index >= 0 && index < cakes.length){
        document.getElementById('cakeIndex').value = index;
        document.getElementById('cakeInputName').value = cakes[index].name;
        document.getElementById('cakeInputDescription').value = cakes[index].description;
        document.getElementById('cakeInputPrice').value = cakes[index].price;
        document.getElementById('cakeInputImage').value = cakes[index].image;

        document.getElementById('addButton').style.display = 'none';
        document.getElementById('cakeInputName').style.display = 'block';
        document.getElementById('cakeInputDescription').style.display = 'block';
        document.getElementById('cakeInputPrice').style.display = 'block';
        document.getElementById('cakeInputImage').style.display = 'block';
        document.getElementById('saveButton').style.display = 'block';
    }
}


function deleteCakeElement(index){
    let cakes = JSON.parse(localStorage.getItem('cakes')) || [];
    if(index >= 0 && index < cakes.length){
        cakes.splice(index, 1);
        localStorage.setItem('cakes', JSON.stringify(cakes));
        loadCakes();
    }
}

function toggledStock(index){
    let cakes = JSON.parse(localStorage.getItem('cakes')) || [];
    if(index >= 0 && index < cakes.length){
        cakes[index].stock = !cakes[index].stock;
        localStorage.setItem('cakes', JSON.stringify(cakes));
        loadCakes();
    }
}