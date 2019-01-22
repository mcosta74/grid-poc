# Backed

## Installation
It requires Python 3.7; all the commands should be executed from the root path

### Create and activate a virtualenv
```
$ python3 -m venv .venv
$ . .venv/bin/activate
```

### Install requirements
```
$ pip install -r requirements.txt
```

## Add test data
```
$ cd backend
$ ./manage.py loaddata ../fixtures/data.json
```
## Run
```
$ cd backend
$ ./manage.py runserver
```
