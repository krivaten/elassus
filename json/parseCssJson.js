let fs = require('fs');
let through = require('through2');
let result = [];
let currentSection = null;
let currentBucket = null;

let cleanCssJson = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;
        let json = JSON.parse(data);
        let result = parseCssJsonArray(json.value);

        fs.writeFile(filePath, JSON.stringify(result), (err) => {
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
    let selectors = item.selectors.map((className) => {
        let classNameArray = className
            .replace(/\\/g, '')
            .split(':');

        let pseudo;
        if (classNameArray.length > 2) {
            pseudo = classNameArray.slice(2);
            className = classNameArray.slice(0, 2);
        } else if (classNameArray.length > 1) {
            pseudo = classNameArray.slice(1);
            className = classNameArray.slice(0, 1);
        } else {
            pseudo = [];
            className = classNameArray;
        }

        pseudo = pseudo.join(':');
        className = className.join(':');

        return {
            className,
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

module.exports = (filePath) => {
    return through.obj((file, encoding, callback) => {
        callback(null, cleanCssJson(filePath));
    });
};
