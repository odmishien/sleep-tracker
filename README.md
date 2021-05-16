# sleep-tracker

## deploy

```
sam deploy --parameter-overrides $(cat .env | tr '\n' ' ')
```
