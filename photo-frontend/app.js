// ========================
// 1. Create API client
// ========================

// IMPORTANT: put your real API key here (from API Gateway -> API keys -> photo-search-key -> Show)
let apigClient;
try {
  apigClient = apigClientFactory.newClient({
    apiKey: 'ufZZx1PrpaavnxQvSsbOk3E02CPWeQUS4SBcveqG'
  });
  console.log('✅ apigClient created');

  // Debug: see what methods the SDK generated
  const clientKeys = Object.keys(apigClient || {});
  console.log('apigClient methods:', clientKeys);
  console.log(
    'photosPut exists?', typeof apigClient.photosPut,
    '| photosObjectPut exists?', typeof apigClient.photosObjectPut
  );
} catch (e) {
  console.error('❌ Error creating apigClient. Is the SDK loaded before app.js?', e);
}

// Helper to show text messages
function showMessage(elementId, text, type = '') {
  const el = document.getElementById(elementId);
  if (!el) {
    console.warn(`showMessage: element #${elementId} not found`);
    return;
  }
  el.textContent = text || '';
  el.style.color =
    type === 'error' ? '#b91c1c'
    : type === 'success' ? '#15803d'
    : '#4b5563';
}


// ========================
// 2. SEARCH: GET /search?q=...
// ========================

async function searchPhotos() {
  console.log('🔎 searchPhotos called');
  const queryInput = document.getElementById('searchQuery');
  const resultsDiv = document.getElementById('results');

  if (!queryInput) {
    console.error('searchPhotos: #searchQuery input not found');
    return;
  }
  if (!resultsDiv) {
    console.error('searchPhotos: #results container not found');
    return;
  }

  const query = queryInput.value.trim();
  resultsDiv.innerHTML = '';
  showMessage('searchMsg', '');

  if (!query) {
    showMessage('searchMsg', 'Please enter a search query.', 'error');
    return;
  }

  if (!apigClient) {
    showMessage('searchMsg', 'API client not initialized (see console).', 'error');
    return;
  }

  showMessage('searchMsg', 'Searching...');
  console.log('search params:', { q: query });

  try {
    const params = { q: query };     // ?q=<query>
    const body = null;
    const additionalParams = {};

    const response = await apigClient.searchGet(params, body, additionalParams);
    console.log('✅ Search raw response:', response);

    const payload = response.data?.body
      ? JSON.parse(response.data.body)
      : response.data;

    console.log('Parsed search payload:', payload);

    const items = payload.results || [];

    if (!items.length) {
      showMessage('searchMsg', 'No results found.', 'error');
      return;
    }

    showMessage('searchMsg', `Found ${items.length} result(s).`, 'success');

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'photo-card';

      const img = document.createElement('img');
      img.src = `https://${item.bucket}.s3.amazonaws.com/${item.objectKey}`;
      img.alt = (item.labels || []).join(', ');

      const caption = document.createElement('div');
      caption.className = 'meta';
      const title = document.createElement('strong');
      title.textContent = item.objectKey.split('/').pop();
      const labelsSpan = document.createElement('span');
      labelsSpan.textContent = (item.labels || []).join(', ');

      caption.appendChild(title);
      caption.appendChild(document.createElement('br'));
      caption.appendChild(labelsSpan);

      card.appendChild(img);
      card.appendChild(caption);
      resultsDiv.appendChild(card);
    });
  } catch (err) {
    console.error('❌ Search error (full Axios error):', err);
    if (err.response) {
      console.error('Search error response status:', err.response.status);
      console.error('Search error response headers:', err.response.headers);
      console.error('Search error response data:', err.response.data);
    }
    showMessage('searchMsg', 'Error performing search (see console).', 'error');
  }
}



// ========================
// 3. UPLOAD: PUT /photos/{object}
//    with x-amz-meta-customLabels
// ========================
// ========================
// 3. UPLOAD: PUT /photos/{object}
//    with x-amz-meta-customLabels
// ========================

async function uploadPhoto() {
    console.log('📤 uploadPhoto called');
  
    const fileInput = document.getElementById('fileInput');
    const labelsInput = document.getElementById('customLabels');
  
    if (!fileInput || !labelsInput) {
      console.error('uploadPhoto: missing fileInput or customLabels element');
      return;
    }
  
    if (!fileInput.files || fileInput.files.length === 0) {
      showMessage('uploadMsg', 'Please choose a photo to upload.', 'error');
      return;
    }
  
    const file = fileInput.files[0];
    console.log('Selected file:', file);
  
    // Build custom labels
    const rawLabels = labelsInput.value.trim();
    const customLabels = rawLabels
      ? rawLabels.split(',').map(s => s.trim()).filter(Boolean).join(', ')
      : '';
  
    // Build the API Gateway URL: /prod/photos/{object}
    const fileName = encodeURIComponent(file.name);
    const apiUrl = `https://8ddmqo3yv3.execute-api.us-east-1.amazonaws.com/prod/photos/${fileName}`;
    console.log('Upload URL:', apiUrl);
    console.log('Custom labels header value:', customLabels);
  
    showMessage('uploadMsg', 'Uploading...');
  
    try {
      const res = await axios.put(apiUrl, file, {
        headers: {
          'Content-Type': file.type || 'image/jpeg',
          'x-amz-meta-customLabels': customLabels,
          'x-api-key': 'ufZZx1PrpaavnxQvSsbOk3E02CPWeQUS4SBcveqG',  // your API key
        },
      });
  
      console.log('✅ Upload success (raw axios):', res);
      showMessage('uploadMsg', 'Upload successful!', 'success');
    } catch (err) {
      console.error('❌ Upload error (raw axios):', err);
  
      if (err.response) {
        console.error('Upload error status:', err.response.status);
        console.error('Upload error headers:', err.response.headers);
        console.error('Upload error data:', err.response.data);
      }
  
      showMessage('uploadMsg', 'Error uploading photo (see console).', 'error');
    }
  }
  
  


  