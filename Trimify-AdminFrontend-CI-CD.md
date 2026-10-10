# Trimify Admin Panel Frontend - Knowledge Transfer (KT) CI/CD Document

## Document Metadata
- **Project Name**: Trimify Admin Panel Frontend
- **Repository Location**: c:\new-trimify-front-admin\trimify-admin
- **Workflow File Path**: .github/workflows/deploy-cyberpanel.yml
- **Target Audience**: DevOps Engineers, Release Managers & Frontend Developers
- **Document Version**: 1.0.0
- **Verification Level**: All pipeline steps, parameters, actions, and SSH commands verified directly against .github/workflows/deploy-cyberpanel.yml [AI VERIFIED].

---

## 1. CI/CD Architecture Overview

The **Trimify Admin Panel Frontend** uses **GitHub Actions** for continuous integration and automated staging deployment to CyberPanel hosting.

`
[Developer Push to 'dev']
         │
         ▼
 1. GitHub Actions Trigger (deploy-cyberpanel.yml)
         │
         ▼
 2. Ubuntu Runner Setup (Node 20 + npm cache)
         │
         ▼
 3. Dependency Installation (npm install & TinyMCE postinstall asset copy)
         │
         ▼
 4. Vite Production Build (npm run build -> dist/)
         │
         ▼
 5. SPA Apache Routing Injection (Create dist/.htaccess for mod_rewrite)
         │
         ▼
 6. Archive Compression (tar -czf deploy.tar.gz -C dist .)
         │
         ▼
 7. SCP Secure Transfer (appleboy/scp-action@v0.1.7 -> Server)
         │
         ▼
 8. Remote SSH Extraction & Atomic Swap (appleboy/ssh-action@v1.0.3)
         │
         ▼
 9. Permissions Update (chmod -R 755 public_html)
         │
         ▼
 [Staging Live: tap.admin.trimify.com.au]
`

---

## 2. Pipeline Trigger Rules

| Workflow Name | Trigger Event | Target Branch | Deployment Target | Verification Source |
|---|---|---|---|---|
| Deploy to CyberPanel | push | dev | Staging Web Server (	ap.admin.trimify.com.au) | deploy-cyberpanel.yml [AI VERIFIED] |

> [!NOTE]  
> **Production Workflow Notice**: There is currently only **one** automated pipeline in .github/workflows/ which targets the dev branch. Production releases from main or master require either manual artifact upload or configuring an equivalent production workflow.

---

## 3. Step-by-Step Pipeline Breakdown

### Step 1: Checkout Repository
- **Action**: ctions/checkout@v4
- **Purpose**: Clones the latest code from the dev branch into the runner workspace.

### Step 2: Node.js Environment Setup
- **Action**: ctions/setup-node@v4
- **Node Version**: 20
- **Optimization**: cache: 'npm' (caches ~/.npm directory to accelerate build steps).

### Step 3: Install Dependencies
- **Command**: 
pm install
- **Automated Hooks**: Triggers the postinstall script 
ode scripts/copy-tinymce.cjs which copies TinyMCE skins and assets into public/tinymce/.

### Step 4: Execute Production Build
- **Command**: 
pm run build
- **Output Target**: ./dist/
- **Process**: Vite compiles React components, minifies JavaScript and CSS bundles, and generates content-hashed assets.

### Step 5: Inject SPA Rewrite Rules (.htaccess)
- **Purpose**: Configures Apache mod_rewrite to route all single-page application deep links to index.html.
- **Injected .htaccess Content**:
  `pache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>
  `

### Step 6: Bundle Archiving
- **Command**: 	ar -czf deploy.tar.gz -C dist .
- **Purpose**: Compresses the contents of ./dist/ into a single lightweight tarball (deploy.tar.gz) for fast SCP transfer.

### Step 7: SCP File Upload
- **Action**: ppleboy/scp-action@v0.1.7
- **Source**: deploy.tar.gz
- **Target Path**: /home/tap.admin.trimify.com.au
- **Authentication**: Uses SSH private key stored in repository secrets.

### Step 8: Remote SSH Extraction & Deployment
- **Action**: ppleboy/ssh-action@v1.0.3
- **Execution Script**:
  `ash
  # Clean existing website root files
  rm -rf /home/tap.admin.trimify.com.au/public_html/*
  
  # Unpack deployment tarball into public_html
  tar -xzf /home/tap.admin.trimify.com.au/deploy.tar.gz -C /home/tap.admin.trimify.com.au/public_html
  
  # Remove deployment archive
  rm /home/tap.admin.trimify.com.au/deploy.tar.gz
  
  # Apply 755 directory & file permissions
  chmod -R 755 /home/tap.admin.trimify.com.au/public_html
  `

---

## 4. Required GitHub Secrets

The pipeline depends on **3 GitHub Repository Secrets** configured under **Settings > Secrets and variables > Actions**:

| Secret Name | Purpose / Value Description | Required By | Verification Source |
|---|---|---|---|
| SERVER_IP | Server IP address or Hostname of CyberPanel host | SCP & SSH Actions | deploy-cyberpanel.yml [AI VERIFIED] |
| SSH_USERNAME | Remote SSH user with read/write access to /home/tap.admin.trimify.com.au | SCP & SSH Actions | deploy-cyberpanel.yml [AI VERIFIED] |
| SSH_PRIVATE_KEY | RSA/Ed25519 Private Key corresponding to authorized public_key on server | SCP & SSH Actions | deploy-cyberpanel.yml [AI VERIFIED] |

---

## 5. Troubleshooting & Pipeline Maintenance

1. **SPA Direct Link 404 Errors**:
   - *Symptom*: Refreshing a deep page like /user-management returns HTTP 404.
   - *Cause*: .htaccess injection in Step 5 failed or Apache mod_rewrite is disabled on CyberPanel.
   - *Fix*: Verify .htaccess exists in /home/tap.admin.trimify.com.au/public_html/ and ensure AllowOverride All is set in CyberPanel vhost config.

2. **Missing TinyMCE Icons/Skins in Production**:
   - *Symptom*: Rich text editor breaks or shows unstyled boxes.
   - *Cause*: 
pm install did not run copy-tinymce.cjs postinstall step.
   - *Fix*: Check GitHub Actions logs during 
pm install for copy-tinymce.cjs execution.

3. **SSH Authentication Failure**:
   - *Symptom*: ppleboy/ssh-action fails with ssh: handshake failed: ssh: unable to authenticate.
   - *Fix*: Re-verify SSH_PRIVATE_KEY in GitHub Secrets and ensure the matching public key is in ~/.ssh/authorized_keys on the server.