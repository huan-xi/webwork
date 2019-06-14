"use strict";

/**
 * 联盟智能合约
 * 初始化：
 * 联盟成员，地位
 *
 *
 */

function init(input) {
    let obj = JSON.parse(input); //检测json格式
    /*初始化联盟角色列表*/
    Chain.store('supplier', JSON.stringify(obj.supplier)); //供应商列表
    Chain.store('producer', JSON.stringify(obj.producer)); //厂商列表
    Chain.store('detection', JSON.stringify(obj.detection)); //检测机构列表
    Chain.store('logistics', JSON.stringify(obj.logistics)); //物流公司列表
    Chain.store('admin',  JSON.stringify(obj.admin)); //将创建者加入管理员列表
    return 'success';
}

//获取用户列表
function getUsers(role) {
    let roles_src = Chain.load(role);
    return JSON.parse(roles_src);
}

//检测用户权限
function checkUser(role, address) {
    let roles = getUsers(role);
    let i;
    if (roles) {
        for (i = 0; i < roles.length; i += 1) {
            if (address === roles[i]) {
                return true;
            }
        }
    }
    return false;
}

function addUser(role, address) {
    if (Utils.addressCheck(address)) {
        throw 'address error!';
    }
    if (!checkUser('admin', Chain.tx.initiator)) {
        return "do not have permission";
    }
    let roles = getUsers(role);
    roles.push(address);
    Chain.store(role, JSON.stringify(roles));
}

function main(input_str) {
    let input = JSON.parse(input_str);
    //方法
    if (input.method === 'addUser') {
       return  addUser(input.params.role, input.params.address);
    } else {
        throw 'no this method';
    }
}

function query(input_str) {
    let input = JSON.parse(input_str);
    //方法
    if (input.method === 'checkUser') {
       return checkUser(input.params.role, input.params.address);
    } else {
        throw 'no this method';
    }
}
