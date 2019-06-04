# Life Calendar

Life Calendar is a light-hearted app for your amusement or self-reflection.

It calculates and displays a table of tiles, with each tile representing two weeks of your life. You can record your past or future life stages by highlighting the tiles, and add notes and colors to the selected period of time. Log in first to save your edits.

The motivation behind a life calendar is discussed more in depth in Tim Urban's [article](https://waitbutwhy.com/2014/05/life-weeks.html).

This project is built with React/Create React App and deployed on AWS.

It's live at [lifecalender.me](https://lifecalender.me). Check it out!

## To install locally:
1) Clone this repository. 
2) Run `npm start` inside the project directory.
3) To connect to your own backend, save your configurations in `config`, and then uncomment the `load,` `storage` event listeners and the `loginButton` function in `index.js`.
4) Please see to the documentation for [create-react-app](https://github.com/facebook/create-react-app) for its usage.