const toggleTheme = document.getElementById('toggleTheme');

const handleThemeToggle = () => { 
    // no first save the dark mode preference to local storage 
    const currentTheme = localStorage.getItem('themeMode') || 'light'; 
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'; 
    localStorage.setItem('themeMode', newTheme); 
    // then toggle the dark class on the html element 
    document.documentElement.classList.toggle('dark'); 
    // now update the body classes accordingly 
    if (newTheme === 'dark') { 
        document.body.classList.remove('bg-white', 'text-gray-800'); 
        document.body.classList.add('bg-gray-900', 'text-gray-100'); 
    } else { 
        document.body.classList.add('bg-white', 'text-gray-800'); 
        document.body.classList.remove('bg-gray-900', 'text-gray-100'); 
    }  
    // now update the button text 
    const themeToggleBtn = document.getElementById('themeToggleBtn'); 
    themeToggleBtn.textContent = newTheme === 'dark' ? 'Switch to Light Mode' : 
'Switch to Dark Mode'; 
} 

toggleTheme.addEventListener('click', handleThemeToggle)