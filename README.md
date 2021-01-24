# Contact API

This API can be used to store contact details (Name, Phone, Email). Taking Email as unique entity.
Storage is hosted on MongoDB.

Endpoints are divided into 2 categories:
- High Level Operation (Operations): Include endpoints which trigger Create, Update and Delete operations.
- Low Level Operation (Query): Include endpoints which only trigger Read Operations.

## Authentication

Basic Authentication is implemented. You only need to put **"secret":"<secret>"** in the request body.
Both Endpoint categories needs different secrets. Secrets can also be changed in .env file.

### Secret for Operations: "JOE"
### Secret for Query: "Biden"

<br>

## Operations Endpoints

- ### POST: ADD

    Endpoint: `/op/add`

    Example Request Body: `{
        "secret": "BIDEN",
        "contact": {
            "name": "abc",
            "phone":5555555555,
            "email": "abc@gmail.com"
        }
    }` 

- ### PUT: UPDATE

    Endpoint: `/op/update`

    Example Request Body: `{
	"secret": "BIDEN",
	"contactEmail": "abc@gmail.com",
	"contact": {
		"name": "abcd"
	}
}` 
    **Note**: Only put the properties that you want to update in the contact object.

- ### DELETE: DELETE

    Endpoint: `/op/delete`

    Example Request Body: `{
	"secret": "BIDEN",
	"contactEmail": "abc@gmail.com"
}` 

## Query Endpoints

**Note**: In All Query Endpoints you can put limit and page properties in request body. Default limit is 10 and page is 1. Both the properties are optional.

- ### GET: All

    Endpoint: `/q/all`

    Example Request Body: `{
	"secret": "JOE"
}`
    Another Example: `{
	"secret": "JOE",
    "limit": 5,
    "page": 2,
}`

- ### GET: SEARCH

    Endpoint: `/q/search`

    Example Request Body: `{
	"secret": "JOE",
	"searchCriteria":"name",
	"value":"abc",
    "limit":5,
}` 
    Another Example: `{
	"secret": "JOE",
	"searchCriteria":"email",
	"value":"abc@gmail.com",
}`

## Validations

- Phone number is validated before any High Level Operation. It needs to be greator than 1000000000 and smaller than 9999999999.
- Email will be validated twice.
  - To check if it is valid email.
  - To check if it already exists in database or not.
  
## Note: I intentionally put my .env file in git-repo, for the assignment purpose. Otherwise it is bad practice to keep .env in remote repo.