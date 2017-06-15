let fs = require('fs');
let through = require('through2');
let cssparser = require('cssparser/lib/cssparser.js');
let result = [];
let currentSection = null;
let currentBucket = null;

let cleanCssJson = (options) => {
    fs.readFile(options.src, 'utf8', (err, data) => {
        if (err) throw err;
        let parser = new cssparser.Parser();
        let ast = parser.parse(data);
        let json = ast.toJSON('simple');
        let result = parseCssJsonArray(json.value);

        currentSection.children.push(currentBucket);
        result.push(currentSection);
        
        fs.unlink(options.src);

        fs.writeFile(options.dest, JSON.stringify(result), (err) => {
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

        let classNameKey;
        if (classNameArray.length > 3) {
            classNameKey = 2;
            let newClassNameArrayEnd = classNameArray.slice(2).join(':');
            classNameArray.splice(2, 2, newClassNameArrayEnd);
            className = classNameArray.slice(0, 2);
        } else if (classNameArray.length > 2) {
            classNameKey = 2;
            className = classNameArray.slice(0, 2);
        } else if (classNameArray.length > 1) {
            classNameKey = 1;
            className = classNameArray.slice(0, 1);
        } else {
            className = classNameArray;
        }

        let pseudo = [];
        let append;

        if (classNameKey) {
            let classNameTail = classNameArray.slice(classNameKey)[0].split(' ');
            pseudo = [ classNameTail.shift() ];
            append = classNameTail.join(' ');
        }

        pseudo = pseudo.join(':');
        className = className.join(':');

        if (append) {
            className += ` ${append}`;
        }

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
