let fs = require('fs');
let through = require('through2');
let result = [];
let currentSection = null;
let currentBucket = null;

let cleanCssJson = () => {
    fs.readFile('./json/css.json', 'utf8', (err, data) => {
        if (err) throw err;
        let json = JSON.parse(data);
        let result = parseCssJsonArray(json.value);

        fs.writeFile("./json/css.json", JSON.stringify(result), (err) => {
            if(err) throw err;
        });
    });
};

let parseCssJsonArray = (data) => {
    data.forEach((item) => {
        let selectors = item.selectors;
        let type = item.type;
        if (selectors && selectors.indexOf('documentation') > -1) setCurrentSection(item);
        else if (type === 'rule') addChild(item);
        else if (type === '@media') addBucket(item);
    });

    return result;
};

let setCurrentSection = (item) => {
    if (currentBucket && currentSection) {
        currentSection.children.push(currentBucket);
    }
    if (currentSection) {
        result.push(currentSection);
    }

    currentSection = {
        title: item.declarations.title.replace(/['"]+/g, ''),
        children: []
    };

    currentBucket = {
        rules: []
    };
};

let addChild = (item) => {
    let selectors = item.selectors.map((selector) => {
        selector = selector
            .replace(/\\/g, '')
            .split(':');

        let pseudo = null;
        if (selector.length > 1) {
            pseudo = selector.pop();
        }

        selector = selector.join(':');

        return {
            selector,
            pseudo
        };
    });

    let declarations = item.declarations;

    currentBucket.rules.push({
        selectors,
        declarations
    });
};

let addBucket = (item) => {
    if (currentBucket) {
        currentSection.children.push(currentBucket);
    }

    let breakpoint = item && item.value[0];
    currentBucket = {
        breakpoint,
        rules: []
    };

    if (item && item.nestedRules) {
        parseCssJsonArray(item.nestedRules);
    }
};

module.exports = () => {
    return through.obj((file, encoding, callback) => {
        callback(null, cleanCssJson());
    });
};
