# plc_python
The backend and frontend Python scripts are related to reading tags from PLC.
The backend part is responsible for collecting data from PLC and saving It to a database. Also, the backend contains APIs to get data.

## To start the backend script.

1. check if Python is installed. In the command terminal type
> python --version
or
> py --version

2. ensure you can run pip from the command line
	py -m pip version

3. ensure pip, setuptools, and wheel are up to date
> py -m pip install --upgrade pip setuptools wheel

4. install a list of requirements specified in a file
> py -m pip install -r requirements.txt

5. run command
> py flaskAPI.py

## To start the frontend part.

1. install Node.js
https://nodejs.org/en/download
to check installation run the command
> npm -version

from the app folder "...\python\react_client\my-react-app"

2. run the command to install dependencies
> npm install

3. start the local development server
> npm run dev

or 

create build
> npm run build
