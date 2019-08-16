## API1
To start the app ```node index.js```
The app get it's config from ```config.js``` which gets a few values from .env files or EXPORT.

### Routes
#### Login
Just gets user and checks if hashes match
#### Signup 
Generates a new user template and puts it in database
#### Check token function
Verify the token in cookie and passes on to next route. 
If cookie is not valid anymore sends a request back to client and says you need to refresh your token