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
        selector = selector.replace(/\\/g, '');
        let pseudo = selector.split(':');

        if (pseudo.length > 1) pseudo = pseudo[pseudo.length -1];
        else pseudo = null;

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
