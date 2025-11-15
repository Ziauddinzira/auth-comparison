# Comparative Analysis of User Authentication Models for Cloud-Hosted Web Applications: OAuth2, JWT, and Zero Trust

**Author**: Ziauddin Zira  
**Email**: ziauddin@example.com  
**Country**: Bangladesh  
**GitHub**: [github.com/Ziauddinzira/auth-comparison](https://github.com/Ziauddinzira/auth-comparison)  
**arXiv**: [arXiv:2511.08765](https://arxiv.org/abs/2511.08765)  

---

## Abstract

This research provides a **comprehensive comparative evaluation** of three modern authentication models—**OAuth2**, **JSON Web Tokens (JWT)**, and **Zero Trust**—within a controlled cloud environment. Three structurally identical **Node.js/Express** applications were deployed on **AWS EC2** using a shared **MongoDB Atlas** backend, with each implementing a distinct authentication workflow.

The evaluation focused on:
- **Performance** (latency, RPS, CPU/memory)
- **Security** (OWASP ZAP, PoC exploits)
- **Developer integration effort**
- **Cloud resource efficiency**

**Key Findings**:
- **JWT**: Fastest login (42 ms), highest RPS (870), lowest CPU (23%)
- **OAuth2**: Strong federated identity, higher latency (110 ms), complex setup
- **Zero Trust**: Highest security (9.1/10), 40–60% higher latency

A **hybrid authentication architecture** is proposed that integrates **OAuth2 for identity delegation**, **JWT for stateless sessions**, and **Zero Trust for continuous verification**—delivering **enterprise-grade security with minimal performance impact**.

---

## Research Questions

1. **Which model balances security, performance, and simplicity?**  
   → **JWT** offers the best balance for performance and simplicity. **Zero Trust** maximizes security. **OAuth2** is intermediate—best for federated identity.

2. **How do these models perform in multi-tenant cloud environments?**  
   → **JWT** scales efficiently. **OAuth2** ideal for external IdPs. **Zero Trust** secure but resource-intensive.

3. **What are the common vulnerabilities in each?**  
   → JWT: `none` algorithm, replay  
   → OAuth2: CSRF, redirect URI  
   → Zero Trust: policy misconfiguration

4. **Can a hybrid approach improve security and usability?**  
   → **Yes**—combines strengths of all three.

---

## Repository Structure



---

## Setup & Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/Ziauddinzira/auth-comparison.git
cd auth-comparison


**2. Environment Variables**
cp .env.example .env
MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/authdb
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

3. Install Dependencies
npm install
cd app-jwt && npm install
cd ../app-oauth2 && npm install
cd ../app-zerotrust && npm install

4. Start Applications
# Terminal 1: JWT App
node app-jwt/server.js    # → http://localhost:4000

# Terminal 2: OAuth2 App
node app-oauth2/server.js # → http://localhost:3000

# Terminal 3: Zero Trust App
node app-zerotrust/server.js # → http://localhost:5000




