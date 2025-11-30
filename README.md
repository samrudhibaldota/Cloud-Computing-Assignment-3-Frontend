# Cloud-Computing-Assignment-3-Frontend
Name: Samrudhi Prashant Baldota
NetID:sb10212

Name: Debika Piriya Dharma Lingam
NetID:dd3873


This is the static frontend for the Photo Album Search system.
It interacts with AWS API Gateway and supports:

Upload Photos

Uploads images to S3

Supports adding custom labels via upload

Sends request with metadata:

x-amz-meta-customLabels: "cat,pet,animal"

Search Photos

Sends requests to API Gateway:

GET /search?q=cat


Displays search results from Lambda → OpenSearch

Supports multi-keyword search (e.g., “cats and dogs”)

Shows results instantly with preview images

AWS Services Used
Service	Purpose
API Gateway	Serves REST API endpoints
S3 Static Website Hosting	Hosts this frontend
AWS Lambda	Backend logic
IAM	Secures API calls

Repository Structure
Cloud-Computing-Assignment-3-Frontend/
│
├── photo-frontend/
│   ├── index.html        # Main UI
│   ├── app.js            # Upload + Search logic
│   ├── style.css         # UI styling
│   ├── apiGateway-js-sdk # SDK for API Gateway
│
└── README.md             # This file
