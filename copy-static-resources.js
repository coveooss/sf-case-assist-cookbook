const fs = require('fs');

const STATIC_RESOURCES_FOLDER = './src/main/default/staticresources';

const main = async () => {
  console.info('Begin copy.');

  // Change this to the real coveoua once released
  const coveouaPath = './node_modules/coveo.analytics/dist';
  if (!fs.existsSync(`${STATIC_RESOURCES_FOLDER}/coveoua`)) {
    fs.mkdirSync(`${STATIC_RESOURCES_FOLDER}/coveoua`);
  }
  fs.copyFileSync(
    `${coveouaPath}/coveoua.js`,
    `${STATIC_RESOURCES_FOLDER}/coveoua/coveoua.js`
  );
  fs.copyFileSync(
    `${coveouaPath}/coveoua.js.map`,
    `${STATIC_RESOURCES_FOLDER}/coveoua/coveoua.js.map`
  );
  console.info('Copied coveoua.js');
};

main().then(() => {
  console.info('Copy done!');
});
