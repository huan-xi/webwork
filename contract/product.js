"use strict";

/**
 * 产品智能合约
 * 初始化：
 * 产品基本信息
 * 所属联盟
 * 创建者
 */

function init(info) {
    let obj = JSON.parse(info); //检测json格式
    /*初始化产品基本信息*/
    obj.info.operator = Chain.tx.initiator;
    Chain.store('initInfo', JSON.stringify(obj.info));
    Chain.store('alliance', obj.alliance);
    return 'success';
}

//添加数据
function addData(info, dataType) {
    info.operator = Chain.tx.initiator;
    //鉴权
    let alliance = Chain.load('alliance');
    let res = Chain.contractQuery(alliance, JSON.stringify({
        'method': 'checkUser',
        'params': {
            'role': dataType,
            'address': info.operator
        }
    }));
    if (res.error) {
        throw 'check user error!';
    }
    if (!res.result) {
        throw 'do not have permission';
    }
    info.timestamp = Chain.block.timestamp;
    Chain.store(`${dataType}Info`, JSON.stringify(info));
}

function main(input_str) {
    let input = JSON.parse(input_str);
    //上链数据
    if (input.method === 'addData') {
        addData(input.params.info, input.params.dataType);
    } else {
        throw 'have no this method';
    }
}

function query(input) {
    return input;
}
