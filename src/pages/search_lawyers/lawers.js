import { lawyers } from "../../../database/lawyers.js";
// lawyer-crud.js - Integrated with efficient Array.map update logic

document.addEventListener('DOMContentLoaded', () => {

    // Step 1: Create an Array of Objects
    // NOTE: This array needs to be a 'let' so it can be re-assigned after map/filter operations.
    let currentLawyers = [...lawyers]; // Use a copy of the imported data
    
    // DOM elements and ID tracking
    const cardsContainer = document.getElementById('lawyerCardsContainer');
    // FIX 1: nextId calculation needs to be based on currentLawyers
    let nextId = currentLawyers.length > 0 ? Math.max(...currentLawyers.map(l => l.id)) + 1 : 1;
    const editModal = document.getElementById('editModal');
    const modalContent = document.getElementById('modalContent');
    
    // NEW: Global variable to track the lawyer currently being edited
    let currentEditId = null; 


    // Function to render the star rating
    function renderRating(rating) {
        const fullStars = Math.floor(rating);
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<span class="text-law-gold">★</span>'; 
            } else if (i === fullStars && rating % 1 !== 0) {
                stars += '<span class="text-law-gold">½</span>'; 
            } else {
                stars += '<span class="text-gray-300 dark:text-gray-600">★</span>'; 
            }
        }
        // FIX 2: Return value needs to be a simple string, not template literal syntax used as a tag
        return `<div class="text-lg">${stars} (${rating.toFixed(1)})</div>`; 
    }

    // Step 2: Display Array of Objects on Webpage (R in CRUD)
    function renderLawyerCards(lawyerList) {
        if (!cardsContainer) return; 
        
        cardsContainer.innerHTML = ''; 
        
        if (lawyerList.length === 0) {
            document.getElementById('noResults').classList.remove('hidden');
            return;
        } else {
            document.getElementById('noResults').classList.add('hidden');
        }

        lawyerList.map(lawyer => {
            const card = document.createElement('div');
            card.classList.add('bg-white', 'dark:bg-gray-800', 'p-6', 'rounded-xl', 'shadow-lg', 'border-t-4', 'border-law-red', 'card-shadow', 'space-y-3');
            
            // FIX 3: Template literals inside card.innerHTML must be correctly enclosed.
            card.innerHTML = `
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${lawyer.name}</h3>
                <p class="text-lg text-law-red font-semibold">${lawyer.specialty} Specialist</p>
                <p class="text-gray-600 dark:text-gray-400">
                    <span class="font-bold">City:</span> ${lawyer.city}
                </p>
                <p class="text-gray-600 dark:text-gray-400">
                    <span class="font-bold">Avg. Fee:</span> PKR ${lawyer.fee.toLocaleString()}
                </p>
                ${renderRating(lawyer.rating)}
                <p class="text-sm text-gray-500 dark:text-gray-500">Bar ID: ${lawyer.barId}</p>

                <div class="flex space-x-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button data-id="${lawyer.id}" class="edit-btn px-4 py-2 bg-law-gold text-gray-900 rounded-lg font-medium hover:bg-law-gold-dark transition">
                        Edit
                    </button>
                    <button data-id="${lawyer.id}" class="delete-btn px-4 py-2 bg-law-red text-white rounded-lg font-medium hover:bg-law-red-dark transition">
                        Delete
                    </button>
                </div>
            `;
            cardsContainer.appendChild(card);
        });

        attachEventListeners();
    }

    // --- Event Listener Attachment ---
    function attachEventListeners() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                // FIX 4: Template literal inside confirm() must be correctly enclosed.
                if (confirm(`Are you sure you want to delete lawyer ID ${id}?`)) { 
                    deleteLawyer(id);
                }
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                // FIX 5: Use currentLawyers instead of 'lawyers'
                const lawyer = currentLawyers.find(l => l.id === id); 
                if (lawyer) {
                    openEditModal(lawyer);
                }
            });
        });
    }


    // --- CRUD Operations Handlers ---

    // Step 3: Add New Object (C in CRUD)
    document.getElementById('addLawyerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newFee = parseInt(document.getElementById('newFee').value);
        const newRating = parseFloat(document.getElementById('newRating').value);

        if (isNaN(newFee) || isNaN(newRating)) {
            alert('Fee and Rating must be valid numbers.');
            return;
        }

        const newLawyer = {
            id: nextId++,
            name: document.getElementById('newName').value.trim(),
            specialty: document.getElementById('newSpecialty').value.trim(),
            city: document.getElementById('newCity').value.trim(),
            fee: newFee,
            rating: newRating,
            // FIX 6: Template literal for barId must be correctly enclosed.
            barId: `PK-NEW-${nextId}` 
        };

        // FIX 7: Push to currentLawyers
        currentLawyers.push(newLawyer); 
        applyFiltersAndRender(); 
        e.target.reset();
        // FIX 8: Template literal for alert must be correctly enclosed.
        alert(`Lawyer ${newLawyer.name} added successfully!`); 
    });

    // Step 4: Implement Delete Functionality (D in CRUD)
    function deleteLawyer(id) {
        // FIX 9: Reassign currentLawyers with the filtered result
        currentLawyers = currentLawyers.filter(lawyer => lawyer.id !== id); 
        applyFiltersAndRender();
        alert(`Lawyer with ID ${id} deleted.`);
    }


    // Step 5: Implement Edit Functionality (U in CRUD)

    // Function to open the modal (Modified to use currentEditId)
    function openEditModal(lawyer) {
        // Store the ID globally
        currentEditId = lawyer.id; 
        
        // Pre-fill the form
        document.getElementById('editName').value = lawyer.name;
        document.getElementById('editSpecialty').value = lawyer.specialty;
        document.getElementById('editCity').value = lawyer.city;
        document.getElementById('editFee').value = lawyer.fee;
        document.getElementById('editRating').value = lawyer.rating;

        // Show the modal
        editModal.classList.remove('hidden');
        
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
        }, 10);
    }

    // Function to close the modal
    function closeModal() {
        modalContent.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            editModal.classList.add('hidden');
            currentEditId = null; // Clear the edit ID when done
        }, 300); 
    }

    document.getElementById('cancelEditBtn').addEventListener('click', closeModal);

    // Update Handler (Using the clean Array.map logic from your request)
    document.getElementById('editLawyerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newFee = parseInt(document.getElementById('editFee').value);
        let newRating = parseFloat(document.getElementById('editRating').value);

        // Validation and Constraint Check
        if (isNaN(newFee) || isNaN(newRating)) {
            alert('Fee and Rating must be valid numbers.');
            return; 
        }
        newRating = Math.min(5.0, Math.max(1.0, newRating));
        
        // ** CORE UPDATE LOGIC: Use Array.map to update the object **
        // FIX 10: Reassign currentLawyers with the new array returned by map
        currentLawyers = currentLawyers.map(lawyer => { 
            return lawyer.id === currentEditId
                ? {
                    ...lawyer, // Keep all existing properties (like barId)
                    name: document.getElementById('editName').value.trim(),
                    specialty: document.getElementById('editSpecialty').value.trim(),
                    city: document.getElementById('editCity').value.trim(),
                    fee: newFee,
                    rating: newRating, 
                }
                : lawyer;
        });

        closeModal(); // Use the unified closeModal function
        applyFiltersAndRender();
        alert('Lawyer updated successfully!');
    });


    // Step 6: Implement Search Filters
    const searchInput = document.getElementById('searchInput');
    const cityFilter = document.getElementById('cityFilter');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const feeFilter = document.getElementById('feeFilter');

    [searchInput, cityFilter, specialtyFilter, ratingFilter, feeFilter].forEach(element => {
        if (element) {
            element.addEventListener('input', applyFiltersAndRender);
            element.addEventListener('change', applyFiltersAndRender); 
        }
    });

    function applyFiltersAndRender() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCity = cityFilter.value;
        const selectedSpecialty = specialtyFilter.value;
        const minRating = parseFloat(ratingFilter.value) || 0;
        const feeRange = feeFilter.value;

        // FIX 11: Filter based on currentLawyers
        let filteredList = currentLawyers.filter(lawyer => { 
            const searchMatch = !searchTerm || 
                                lawyer.name.toLowerCase().includes(searchTerm) || 
                                lawyer.barId.toLowerCase().includes(searchTerm);
            const cityMatch = !selectedCity || lawyer.city === selectedCity;
            const specialtyMatch = !selectedSpecialty || lawyer.specialty === selectedSpecialty;
            const ratingMatch = lawyer.rating >= minRating;

            let feeMatch = true;
            if (feeRange === 'low') {
                feeMatch = lawyer.fee < 15000;
            } else if (feeRange === 'high') {
                feeMatch = lawyer.fee > 20000;
            }

            return searchMatch && cityMatch && specialtyMatch && ratingMatch && feeMatch;
        });

        renderLawyerCards(filteredList);
    }

    // Initial load: This call renders the data when the script is loaded
    applyFiltersAndRender();
});