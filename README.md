# Life Calendar

Life Calendar is a light-hearted app for amusement or self-reflection purposes.

It takes the user's birthday and prints out a collection of tiles, with each tile representing two weeks of the person's life.

Each tile is marked with a date and the user's age on that date, calculated using a datetime library and array methods.

Users may add notes and colors to the tiles, log in through social media accounts, and save their edits in a NoSQL database through RESTful API.

The app is optimized with memoized React functions to prevent unnecessary re-renders. It is deployed on AWS (DynamoDB, Lambda, API Gateway, Cognito, Route 53, etc).

The motivation behind a life calendar is discussed more in depth in Tim Urban's [article](https://waitbutwhy.com/2014/05/life-weeks.html).

It's live at [lifecalender.me](https://lifecalender.me). Check it out!

<img
  src='https://victorwang.info/static/media/calendar.8cc51bd3.png'
  alt=''
/>

## To install locally

1) Clone this repository.
2) Run `npm start` inside the project directory.
3) To connect to your own backend, save your configurations in `config`, and then uncomment the `load,` `storage` event listeners and the `loginButton` function in `index.js`.
4) Please see to the documentation for [create-react-app](https://github.com/facebook/create-react-app) for its usage.
