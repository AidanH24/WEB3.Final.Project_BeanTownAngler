function loadResults(event) {
  // Prevent the default form submission behavior
  if (event) event.preventDefault();
  
  const resultBox = document.getElementById('resultBox');
  if (!resultBox) return;

  // Show loading indicator
  resultBox.innerHTML = `
      <div class="col-lg-12 text-center">
          <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
          <p>Loading results...</p>
      </div>
  `;

  // Get form data
  const table = document.getElementById('table').value;
  const searchValue = document.getElementById('search_value').value;
  
  console.log("Searching:", { table, searchValue });
  
  // Create form data object
  const formData = new FormData();
  formData.append('table', table);
  formData.append('search_value', searchValue);

  // Send POST request with form data
  fetch('admin.php', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    // Check if response is OK
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    // Check content type to ensure it's JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // If not JSON, get the text and show it for debugging
      return response.text().then(text => {
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
      });
    }
    
    return response.json();
  })
  .then(data => {
    resultBox.innerHTML = '';
    console.log("Response data:", data);

    if (!data.success) {
      resultBox.innerHTML = `
        <div class="col-lg-12 text-center">
          <p>Error: ${data.error || 'Unknown error occurred'}</p>
        </div>
      `;
      return;
    }

    if (data.data.length === 0) {
      resultBox.innerHTML = `
        <div class="col-lg-12 text-center">
          <p>No results found for your search "${searchValue}" in ${table}.</p>
        </div>
      `;
      return;
    }

    // Success message
    resultBox.innerHTML = `
      <div class="alert alert-success">
        Found ${data.count} result(s) for "${searchValue}" in ${table}.
      </div>
    `;

    // Create a table to display results
    let tableHTML = '<table class="table table-striped"><thead><tr>';
    
    // Get headers from the first result
    const firstResult = data.data[0];
    for (const key in firstResult) {
      tableHTML += `<th>${key}</th>`;
    }
    tableHTML += '</tr></thead><tbody>';
    
    // Add all results
    data.data.forEach(item => {
      tableHTML += '<tr>';
      for (const key in item) {
        tableHTML += `<td>${item[key]}</td>`;
      }
      tableHTML += '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    resultBox.innerHTML += tableHTML;
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    resultBox.innerHTML = `
      <div class="col-lg-12 text-center">
        <div class="alert alert-danger">
          <h5>Unable to load results</h5>
          <p>Error details: ${error.message}</p>
          <p>Try refreshing the page or check your database connection.</p>
        </div>
        <button onclick="loadResults()" class="btn btn-primary">Retry</button>
        
        <div class="mt-3">
          <h6>Troubleshooting steps:</h6>
          <ol class="text-start">
            <li>Check if the database is running</li>
            <li>Ensure the table names match your database exactly</li>
            <li>Verify admin.php is in the same directory as this HTML file</li>
            <li>Check PHP error logs for more information</li>
          </ol>
        </div>
      </div>
    `;
  });
}

// Add event listener when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Attach the event listener to the form
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', loadResults);
  }
  
  // Also attach to the search button
  const searchButton = document.querySelector('.button');
  if (searchButton) {
    searchButton.addEventListener('click', loadResults);
  }
});