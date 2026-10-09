## CASHGROW

CashGrow is a budgeting solution meant to help people be more engaged with their spending. It aspires to keep users more focused and aware of their finances. The main aims of the project are to:
-	Create a solution that integrates multiple kinds of visualisation
-	Integrate a character that reacts to the user’s budgeting success to have a more impactful visual representation of the user’s financial habits and situation. 
These should keep the user wanting to come back to the solution to see the fruits of their labour and to understand the different intricacies of their spending habits. 


## TECH STACK

Frontend:
- React
- React Router
- D3.js
- Axios
- Vite

Backend:
- Node.js
- Express
- MySQL
- JWT
- bcrypt
- Multer
- CSV Parser
- Google Gemini API


## ARCHITECTURE


             +----------------------+
             |     React Frontend   |
             |   (User Interface)   |
             +----------+-----------+
                        |
                        | HTTP / API requests
                        v
             +----------------------+
             |   Node.js / Express  |
             |      Backend API     |
             +----+------------+----+
                  |            |
           Database queries    | AI image requests
                  |            |
                  v            v
          +---------------+  +----------------+
          |    MySQL      |  |  Google Gemini |
          | User &        |  | Tree image     |
          | Transaction   |  | generation     |
          | Data           |  +----------------+
          +---------------+


