export default class PlistUtil 
{
    static parsePlistXML(node) 
    {
        var i, new_obj, key, val, new_arr, res, counter, type;

        if (!node)
            return null;

        if (node.nodeName === 'plist') {
            new_arr = [];
            if (PlistUtil.isEmptyNode(node)) {
                return new_arr;
            }
            for (i = 0; i < node.childNodes.length; i++) {
                if (!PlistUtil.shouldIgnoreNode(node.childNodes[i])) {
                    new_arr.push(PlistUtil.parsePlistXML(node.childNodes[i]));
                }
            }
            return new_arr;
        } else if (node.nodeName === 'dict') {
            new_obj = {};
            key = null;
            counter = 0;
            if (PlistUtil.isEmptyNode(node)) {
                return new_obj;
            }
            for (i = 0; i < node.childNodes.length; i++) {
                if (PlistUtil.shouldIgnoreNode(node.childNodes[i])) continue;
                if (counter % 2 === 0) {
                    if(PlistUtil.TEST) console.log(
                        node.childNodes[i].nodeName === 'key',
                        'Missing key while parsing <dict/>.'
                    );
                    key = PlistUtil.parsePlistXML(node.childNodes[i]);
                } else {
                    if(PlistUtil.TEST) console.log(
                        node.childNodes[i].nodeName !== 'key',
                        'Unexpected key "'
                        + PlistUtil.parsePlistXML(node.childNodes[i])
                        + '" while parsing <dict/>.'
                    );
                    new_obj[key] = PlistUtil.parsePlistXML(node.childNodes[i]);
                }
                counter += 1;
            }
            if (counter % 2 === 1) {
                new_obj[key] = '';
            }

            return new_obj;

        } else if (node.nodeName === 'array') {
            new_arr = [];
            if (PlistUtil.isEmptyNode(node)) {
                return new_arr;
            }
            for (i = 0; i < node.childNodes.length; i++) {
                if (!PlistUtil.shouldIgnoreNode(node.childNodes[i])) {
                    res = PlistUtil.parsePlistXML(node.childNodes[i]);
                    if (null != res) new_arr.push(res);
                }
            }
            return new_arr;

        } else if (node.nodeName === '#text') {
            // TODO: what should we do with text types? (CDATA sections)

        } else if (node.nodeName === 'key') {
            if (PlistUtil.isEmptyNode(node)) {
                return '';
            }

            if(PlistUtil.TEST) console.log(
                node.childNodes[0].nodeValue !== '__proto__',
                '__proto__ keys can lead to prototype pollution. More details on CVE-2022-22912'
            );

            return node.childNodes[0].nodeValue;
        } else if (node.nodeName === 'string') {
            res = '';
            if (PlistUtil.isEmptyNode(node)) {
                return res;
            }
            for (i = 0; i < node.childNodes.length; i++) {
                var type = node.childNodes[i].nodeType;
                if (type === PlistUtil.TEXT_NODE || type === PlistUtil.CDATA_NODE) {
                    res += node.childNodes[i].nodeValue;
                }
            }
            return res;

        } else if (node.nodeName === 'integer') {
            if(PlistUtil.TEST) console.log(
                !PlistUtil.isEmptyNode(node),
                'Cannot parse "" as integer.'
            );
            return parseInt(node.childNodes[0].nodeValue, 10);

        } else if (node.nodeName === 'real') {
            if(PlistUtil.TEST) console.log(
                !PlistUtil.isEmptyNode(node),
                'Cannot parse "" as real.'
            );
            res = '';
            for (i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].nodeType === PlistUtil.TEXT_NODE) {
                    res += node.childNodes[i].nodeValue;
                }
            }
            return parseFloat(res);

        } else if (node.nodeName === 'data') {
            res = '';
            if (PlistUtil.isEmptyNode(node)) {
                return Buffer.from(res, 'base64');
            }
            for (i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].nodeType === PlistUtil.TEXT_NODE) {
                    res += node.childNodes[i].nodeValue.replace(/\s+/g, '');
                }
            }
            return Buffer.from(res, 'base64');

        } else if (node.nodeName === 'date') {
            if(PlistUtil.TEST) console.log(
                !PlistUtil.isEmptyNode(node),
                'Cannot parse "" as Date.'
            )
            return new Date(node.childNodes[0].nodeValue);

        } else if (node.nodeName === 'null') {
            return null;

        } else if (node.nodeName === 'true') {
            return true;

        } else if (node.nodeName === 'false') {
            return false;
        } else {
            throw new Error('Invalid PLIST tag ' + node.nodeName);
        }
    }

    static shouldIgnoreNode (node) 
    {
        return node.nodeType === PlistUtil.TEXT_NODE
          || node.nodeType === PlistUtil.COMMENT_NODE
          || node.nodeType === PlistUtil.CDATA_NODE;
    }

    static isEmptyNode(node)
    {
        if(!node.childNodes || node.childNodes.length === 0) {
          return true;
        } else {
          return false;
        }
    }
}

PlistUtil.TEXT_NODE = 3;
PlistUtil.CDATA_NODE = 4;
PlistUtil.COMMENT_NODE = 8;
PlistUtil.TEST=false;