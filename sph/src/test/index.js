args[0].setLoading('commit', true)
const formData = this.formModels
const autoFillIn = () => {
  const reason = this.formModels['MK_COMMON_EXPENSE#REASON']
  const amount = this.formModels['MK_COMMON_EXPENSE#REIMBURSEMENT_AMOUNT']
  // 模型字段赋值
  this.$updateModel('MK_COMMON_EXPENSE#TITLE', reason)
  this.$updateModel('MK_COMMON_EXPENSE#AMOUNT', amount)
}
// 所有场景都赋值
autoFillIn();

// 校验预计支付金额不能大于调整后的暂缓余额
const validateMoney = () => {
  const {
    aftSuspendAdPay
  } = JSON.parse(localStorage.getItem('paymentDoc'));
  const actualPamentAmount = this.formModels['MK_COMMON_EXPENSE#ACTUAL_PAYMENT_AMOUNT'].split('|')[1];
  if (Number(aftSuspendAdPay) < Number(actualPamentAmount)) {
    this.$message.warning('预计支付金额不可大于调整后的暂缓余额，请核查');
    return false;
  } else {
    return true;
  }
}

/*
* @date: 23/3/15
* @author: junhuChen
* @params: 
* @cause: 在提交的时候调用后端接口，扣减暂缓支付台账对应来源单据那一条台账的调整后暂缓余额【AFT_SUSPEND_AD_PAY】,现改为将接口配到流程里面，前端不再调用
*/
// // 点击提交按钮并且提交成功后，扣除台账上的可用金额
// const paymentDocRequest = (params) => {
//     return this.$http({
//         url: `/mdfp/fsp/deferred/pay/decrease/balance`,
//         method: "post",
//         data: params
//     });
// }
// const doPaymentDoc = async () => {
//     const isFromPaymentDoc = JSON.parse(localStorage.getItem('isFromPaymentDoc'));
//     if (!isFromPaymentDoc) return;
//     const {
//         objectId
//     } = JSON.parse(localStorage.getItem('paymentDoc'));
//     const params = {
//         amount: '-' + this.formModels['MK_COMMON_EXPENSE#ACTUAL_PAYMENT_AMOUNT'].split('|')[1],
//         objectId,
//     }

//     const res = await paymentDocRequest(params);
// }

// 自动填充上计划付款行的暂缓调整金额
const autoSetMoney = () => {
  const payAmountTableVm = this.getFormTable("64cshy3yptk0");
  const payAmountTableData = payAmountTableVm.getTableData();
  const APPLY_LE_CURRENCY = formData["MK_COMMON_EXPENSE#APPLY_LE_CURRENCY"]; //核算主体币种
  payAmountTableData.forEach(item => {
    item['SUSPEND_ADJUST_PAY'] = APPLY_LE_CURRENCY + '|' + '0'
  });
  payAmountTableVm.setTableData(payAmountTableData);
}
autoSetMoney();

//费用事前申请单详情
const orderDetail = (id) => {
  return this.$http({
    url: `/platform/data-model/dynamic/query/detail/MDFP_MK_TRAVEL_APPLICATION_DETAIL/${id}`,
    method: "post",
  });
};

// 变更或新增消费类型时，调用后端二开接口确定是否需要预算部门负责人审核
const tableD = this.getFormTable("1p3lp9462gcg");
let consumeTypeList = [];
if (tableD != null) {
  tableD.tableData.forEach(item => {
    consumeTypeList.push(item.CONSUMPTION_TYPE)
    console.log("item-----", item);
    console.log("========consumeTypeList", consumeTypeList);
  })
}


const row = this.rowData

// 查询维度值详情，含扩展字段
const qryBatchDimObject = (data) => {
  return this.$http({
    url: '/mrf/dim/dim_object/qryBatchDimObject',
    method: 'get',
    params: {
      ...data,
    },
  });
}

// 校验定位单元格
const get_bm_unit_list = (data) => {
  return this.$http({
    url: '/mrf/bm/bm_attribution_value/get_bm_unit_list',
    method: 'post',
    data: {
      ...data,
    },
  });
}

/*
formModels-头信息
row-当前行
topCode-数据模型编码
mxCode-明细的模型编码
gsBindField-绑定字段
gsHeadCode-预算归属头模型编码
gsLineCode-预算归属行模型编码
price-分摊金额
department-部门
ysgsColumnCode-预算归属字段编码
*/
const setGuishuRule = async (formModels, row, topCode, mxCode, gsBindField, gsHeadCode, gsLineCode, price, department, ysgsColumnCode) => {

  const ruleJsonStrList = this.$vm.$store.state.comState.ruleJsonStrList;
  const ruleList = ruleJsonStrList.filter(item => (item.BIND_FIELD && item.BIND_FIELD.includes(gsBindField)));
  for (let i = 0; i < ruleList.length; i++) {
    const rule = ruleList[i];
    if (rule && rule.RULE_JSON_STR.length) {
      const rowData = row;
      const ruleObj = {};
      rule.RULE_JSON_STR.forEach(item => {
        const key = item.pointValue;
        if (key.includes(`${topCode}#`)) {
          ruleObj[key] = formModels[key];
        } else if (key.includes(`${mxCode}#`)) {
          const rowKey = key.split('#')[1];
          ruleObj[key] = row[rowKey];
        }
      });
      const objLine = {};
      const dataModelCode = 'BM_MODEL_GY_10';
      objLine[dataModelCode] = [];

      const dimObjectIds = Object.values(ruleObj).filter(item => item).join(',');
      if (!dimObjectIds) {
        this.$message.warning('预算归属不能为空！');
        return;
      }
      const res = await qryBatchDimObject({
        objectIds: dimObjectIds
      });
      const dimObjectList = res.data;
      console.log(dimObjectList, '维度值详情===》〉》');
      dimObjectList.forEach(item => {
        const obj = {};
        obj.dimTypeId = item.typeId;
        obj.dimTypeCode = item.typeCode;
        obj.objectId = item.objectId;
        obj.objectCode = item.objectCode;
        obj.objectName = item.objectName;
        objLine[dataModelCode].push(obj);
      })
      this.lineList = objLine;
      console.log(this.lineList, 'this.lineList==');
      const childModels_gsHead = addGSHead(row, gsHeadCode);
      console.log('预算归属头===>', childModels_gsHead);
      const childModels_gsLine = addGSLine(row, price, this.lineList, gsLineCode, department, ysgsColumnCode)
      console.log('预算归属行===>', childModels_gsLine);


      // 三层结构
      const data = [{
        modelCode: gsHeadCode,
        modelData: [{
          ...childModels_gsHead.modelData[0], // 预算归属头信息
          OBJECT_ID: childModels_gsHead.modelData[0] ?
            childModels_gsHead.modelData[0].OBJECT_ID : '',
          // PREPAID_AMOUNT: this.noPrepiad,// 待摊总金额
          // PREPAIDED_PRICE: this.hasPrepiad,// 已摊总金额
          childModels: [{
            modelCode: gsLineCode,
            modelData: childModels_gsLine,
          },],
        },],
      },];
      row.childModels = data;
    }
  }
}
// 处理数据模型数据详情返回的childModels
const resetChildrenModels = (dataObjectList) => {

  const dataList = [];
  dataObjectList.forEach((dataObject) => {
    if (dataObject === undefined || dataObject == null) {
      dataList.push(dataObject);
    }

    const dataN = {};
    Object.assign(dataN, dataObject);
    if (dataObject.childModels !== undefined) {
      delete dataN.childModels;
      dataObject.childModels.forEach((childModel) => {
        dataN[childModel.modelCode] = resetChildrenModels(childModel.modelData);
      });
    }
    dataList.push(dataN);
  });

  return dataList;
};
/*row-当前行
 *金额-price
 *预算归属默认值-lineList
 *预算归属行的模型编码-endCode
 *部门-DEPARTMENT
 *归属字段的编码-columnCode
 */
const addGSLine = (row, price, lineList, endCode, DEPARTMENT, columnCode = 'YSGS') => {
  const tableData = [];
  const gsHead = resetChildrenModels([row])[0].MD_BG_ATTR;
  if (gsHead && gsHead.length) {
    const gsLine = gsHead[0].BM_MODEL_GY_10;
    gsLine.forEach((item, index) => {
      if (item.YSGS.startsWith('{')) {
        tableData.push(item);
      } else if (item.YSGS && !item.YSGS.startsWith('{')) {
        if (item.PREPAID_PRICE != price) {
          item.PREPAID_PRICE = price;
        }
        tableData.push(item);
      }
    })
  } else {
    const date = new Date().getTime();
    const adddata = {
      YSGS: '', // "400054783",
      GS_DATE: date,
      AMOUNT: 1, // 金额控制
      ACOUNT: 0, // 数量控制
      PREPAID_PRICE: price ? price : '32|0',
      PREPAID_PRICE_PERCENT: price ? '100' : '0',
      YS_DEDCTION_PRICE: price ? price : '32|0',
      PREPAID_ACOUNT: 0,
      PREPAID_COUNT_PERCENT: 0,
      YS_DEDUCTION_COUNT: 0,
    };
    // this.formatprice(adddata);// 计算金额比例
    console.log(adddata)
    if (lineList[endCode]) {
      const YSGS = {};
      YSGS.columnCode = columnCode;
      YSGS.lineList = lineList[endCode];
      YSGS.applyByOrgId = DEPARTMENT;
      YSGS.dataModelCode = endCode;
      YSGS.attributionDate = this.$moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
      adddata.YSGS = JSON.stringify(YSGS);
    }

    tableData.push(adddata);
  }

  console.log('table===', tableData);
  return tableData;

}

/*
 *row-当前行
 *预算归属头的模型编码-gsHeadCode
 */
const addGSHead = (row, gsHeadCode) => {

  let headInfo = {};
  if (row.childModels) {
    const waiCengInfo = row.childModels[0].modelData[0];

    headInfo = {
      ...waiCengInfo
    }
    // headInfo.OBJECT_ID = null;
    delete headInfo.childModels;
  }
  const childModels = {
    modelCode: gsHeadCode,
    modelData: [headInfo]
  };
  return childModels
}
const setDefultYSGS = async () => {
  const pageFormData = this.$vm.pageForm.getModelData();
  const params = pageFormData.params;
  for (let i = 0; i < params.childModels.length; i++) {
    const item = params.childModels[i];
    const {
      modelCode,
      modelData
    } = item;
    const topCode = params.modelCode;
    const mxCode = modelCode;
    const gsBindField = `${mxCode}.MD_BG_ATTR.BM_MODEL_GY_10`;
    const gsHeadCode = 'MD_BG_ATTR';
    const gsLineCode = 'BM_MODEL_GY_10';
    const ysgsColumnCode = 'YSGS';


    if (modelCode == "MK_COMMON_EXPENSE_DT") {

      for (let j = 0; j < modelData.length; j++) {
        const mxItem = modelData[j];
        // if (mxItem.childModels[0].modelData[0].childModels[0].modelData[0].SOURCE_BG_ID) {
        if (mxItem.ADVANCE_APPLICATION_NUMBER) {
          if (mxItem.BOP_FLAG == 1) {
            mxItem.childModels[0].modelData[0].SRC_BILL_LINE_ID = '';
            mxItem.childModels[0].modelData[0].SRC_BILL_ID = '';
            mxItem.childModels[0].modelData[0].SRC_BILL_DM_CODE = '';
            mxItem.childModels[0].modelData[0].childModels[0].modelData[0].SOURCE_BG_ID = '';
            // 当明细行关联事前申请带出BOP_FLAG=1的时候，报账单直接发生，而不是占用转发生
          }
          mxItem.childModels[0].modelData[0].childModels[0].modelData[0].PREPAID_PRICE = mxItem.ORIGINAL_CURRENCY_LOCAL;
          mxItem.childModels[0].modelData[0].childModels[0].modelData[0].YS_DEDCTION_PRICE = mxItem.ORIGINAL_CURRENCY_LOCAL;
        }
        // if (!mxItem.childModels[0].modelData[0].childModels[0].modelData[0].SOURCE_BG_ID) {
        if (!mxItem.ADVANCE_APPLICATION_NUMBER) {
          const price = mxItem.ORIGINAL_CURRENCY_LOCAL; // 每个单据字段不一定相同
          const department = mxItem.SUBORDINATE_DEPARTMENTS;
          await setGuishuRule(this.formModels, mxItem, topCode, mxCode, gsBindField, gsHeadCode, gsLineCode, price, department, ysgsColumnCode)
        }



      }
    }
  }
}
// 校验单元格
const validYSGSUnit = async (dmData) => {

  modelCodeMap = {
    MK_COMMON_EXPENSE_DT: '报账单明细区',

  }
  const modelCodes = Object.keys(modelCodeMap);
  let canTo = true;
  for (let k = 0; k < modelCodes.length; k++) {
    const mxCode = modelCodes[k];
    const mxList = dmData[0][mxCode];
    for (let m = 0; m < mxList.length; m++) {
      const MD_BG_ATTR = mxList[m].MD_BG_ATTR;
      const childModels_gsLine = MD_BG_ATTR[0].BM_MODEL_GY_10;

      for (let n = 0; n < childModels_gsLine.length; n++) {
        const lineItem = childModels_gsLine[n];
        if (lineItem.YSGS.startsWith('{')) {
          const YSGS_obj = JSON.parse(lineItem.YSGS);
          const resUnitList = await get_bm_unit_list(YSGS_obj).catch(res => {
            return res
          });
          if (resUnitList.code != 800) {
            this.$message.warning(`${modelCodeMap[mxCode]},第${m + 1}条数据定位预算单元格失败!`);
            canTo = false;
            return false;
          }
        }
      }
    }
  }
  return canTo;
}

const billId = args[0].OBJECT_ID
console.log('formData=====', formData);

//获取审批维度信息
const getAllApprovalDim = () => {
  return this.$http({
    url: `/mrf/dim/dim-obj/all/page?page=1&size=100`,
    method: 'post',
    data: {
      "typeId": "5000060024",
      "parentId": 0
    }
  })
}

//获取审批维度关联表信息
const checkApprove = (billId) => {
  return this.$http({
    url: `/mdfp/fsp/process/approve/validateBeforeSubmit/${billId}`,
    method: 'post',
  })
}

//获取供应商信息
const supplierDetail = (id) => {
  return this.$http({
    url: `/platform/data-model/dynamic/query/detail/MDFP_MD_AB_BA_SUPPLIER_DETAIL/${id}`,
    method: 'post',
  });
}
// 校验金额是否分摊完
validShareAll = (tableKey, moneyKey) => {

  // 明细区列表的数据 //mduxya1huz
  const tableData = this.getFormTable(tableKey).tableData;
  if (tableData.length) {
    return tableData.every(item => {
      if (item.childModels && item.childModels.length) {
        // 判断是否有预算归属头信息
        const hasMD_BG_ATTR = item.childModels.every(item1 => {
          const MD_BG_ATTR_modelData = item1.modelData || [];
          if (MD_BG_ATTR_modelData.length) {
            // 判断是否有预算归属行信息
            const hasBM_MODEL_GY_10 = MD_BG_ATTR_modelData.every(item2 => {
              if (item2.childModels && item2.childModels.length) {
                // 判断是否分摊完
                const isShareAll = item2.childModels.every(item3 => {

                  const BM_MODEL_GY_10_modelData = item3.modelData || [];
                  // 把预算归属行的分摊金额加起来
                  let sum = 0;
                  BM_MODEL_GY_10_modelData.forEach(item4 => {
                    let amount = item4.PREPAID_PRICE; // 分摊金额
                    let num = amount.split('|')[1] || 0
                    sum = this.$mathArithmetic.add(sum, num);
                  })
                  const APPLICATION_AMOUNT = item[moneyKey].split('|')[1] || 0 // 明细行的申请金额
                  return sum == Number(APPLICATION_AMOUNT)
                })
                return isShareAll;
              } else {
                this.$message.warning('预算归属信息不能为空');
                return false;
              }
            })
            return hasBM_MODEL_GY_10
          } else {
            this.$message.warning('预算归属信息不能为空');
            return false
          }
        })
        return hasMD_BG_ATTR;
      } else {
        this.$message.warning('预算归属信息不能为空');
        return false
      }
    })
  } else {
    this.$message.warning('申请明细不能为空');
    return false
  }
}
// 校验
const validate = async (info) => {
  // 获取报账明细行的数据
  const tableData = this.getFormTable("1p3lp9462gcg").tableData;

  await setDefultYSGS();

  if (args[0].ROOT_ID) {
    if (!validShareAll('1p3lp9462gcg', 'ORIGINAL_CURRENCY_LOCAL')) {
      this.$message.warning('预算归属未分摊金额不为0')
      return;
    }
    // 调接口查询供应商信息给供应商编码和供应商名称赋值
    const id01 = formData["MK_COMMON_EXPENSE#ACCOUNT_NAME1"];
    if (id01 != '') {
      const data = await supplierDetail(id01);

      console.log('data=====', data);
      const ObjectId = data.data.OBJECT_ID;
      console.log('data=====111111', ObjectId);
      // 维度OBJECTID
      this.$updateModel('MK_COMMON_EXPENSE#DIM_SUPPLIER', ObjectId);
      this.$updateModel('MK_COMMON_EXPENSE#SUPPLIER', ObjectId);
    }


    const tableYFK = this.getFormTable("3l089ccr0zk0") //预付款核销明细行
    const tableBZ = this.getFormTable("1p3lp9462gcg") //报账明细行
    const BZtableData = this.getFormTable("1p3lp9462gcg").tableData
    let BzTypeArr = [] //行详情的核算部门集合
    let AllDimarr = [] //审批岗位维度的所有消费类型
    let ResultArr = [] //消费类型匹配结果
    let arr = [] //存储匹配的单号
    var amount_arr = []

    // BZtableData.forEach((item) => {
    //     BzTypeArr.push(item.CONSUMPTION_TYPE)
    // })
    // let DimResult = await getAllApprovalDim()
    // for (let i in DimResult.data) {
    //     let temStr = DimResult.data[i].externalAttr.EXP;
    //     temStr = temStr.replace(/\s+/g, '').replace(/,+/g, ',').replace(/^\[,+/g, '[').replace(/,+\]$/, ']').replace(/\s+/g, '');
    //     const str = temStr ? JSON.parse(temStr) : [];
    //     for (let j in str) {
    //         AllDimarr.push(str[j])
    //     }
    // }
    // AllDimarr = new Set(AllDimarr)
    // BzTypeArr.forEach(item => {
    //     AllDimarr.forEach(item2 => {
    //         if (item == item2) {
    //             console.log('已找到', item)
    //             ResultArr.push(item)
    //         }
    //     })
    // })
    // let checkApproveResult = await checkApprove(billId)
    // let ApproveData = checkApproveResult.data //审批维度查询结果
    // if (ResultArr.length != 0 && ApproveData == true) {
    //预付款核销明细为空且接口调用成功的时候允许提交
    if (tableYFK.tableData.length == 0) {
      autoFillIn();
      const isFromPaymentDoc = JSON.parse(localStorage.getItem('isFromPaymentDoc'));
      if (isFromPaymentDoc && !validateMoney()) return;
      // doPaymentDoc();
      event();
    } else {
      try {
        //本次核销金额都为0时允许提交
        tableYFK.tableData.forEach((item) => {
          amount_arr.push({
            CURRENT_WRITE_OFF_AMOUNT: item.CURRENT_WRITE_OFF_AMOUNT.split('|')[1] || 0
          })
        })
        console.log("amount_arr", amount_arr)
        let flag = '0'
        let result = amount_arr.every(item => item.CURRENT_WRITE_OFF_AMOUNT == flag)
        console.log("result===", result)
        // 当结果为true且接口调用成功的时候执行event
        if (result == true) {
          autoFillIn();
          const isFromPaymentDoc = JSON.parse(localStorage.getItem('isFromPaymentDoc'));
          if (isFromPaymentDoc && !validateMoney()) return;
          // doPaymentDoc();
          event();
          throw new Error('LoopInterrupt')
        }

        tableBZ.tableData.forEach(item => {

          var BZ_Sq_Num = item.ADVANCE_APPLICATION_NUMBER_DATA_MODEL_SOURCE_DOC_NUMBER //报账明细事前申请单号
          console.log("BZ_Sq_Num==>", BZ_Sq_Num)

          tableYFK.tableData.forEach(item => {
            var YFK_Sq_Num = item.SOURCE_DOC_NUM //预付款事前申请单号
            let Off_Amount = item.CURRENT_WRITE_OFF_AMOUNT.split('|')[1] || 0 //本次核销金额
            console.log("YFK_Sq_Num==>", YFK_Sq_Num)
            //核销空的事前申请单号的单时，且报账明细存在空的事前申请单号时，允许提交，还要接口调用成功this.middleConvert=1的时候
            if (YFK_Sq_Num == "" && Off_Amount != "0" && BZ_Sq_Num == "") {
              autoFillIn();
              const isFromPaymentDoc = JSON.parse(localStorage.getItem('isFromPaymentDoc'));
              if (isFromPaymentDoc && !validateMoney()) return;
              // doPaymentDoc();
              event();
              throw new Error('LoopInterrupt')
            }
            //核销空的事前申请单号的单时，且接口调用成功，允许提交
            if (YFK_Sq_Num == "" && Off_Amount != "0") {
              autoFillIn();
              const isFromPaymentDoc = JSON.parse(localStorage.getItem('isFromPaymentDoc'));
              if (isFromPaymentDoc && !validateMoney()) return;
              // doPaymentDoc();
              event();
              throw new Error('LoopInterrupt')
            }
            //核销非空的事前申请单号的单时，报账明细存在相同的事前申请单，允许提交；否则不允许提交
            if (BZ_Sq_Num === YFK_Sq_Num) {
              if (Off_Amount != "0") {
                arr.push(YFK_Sq_Num)
                console.log("arr", arr)
              }
            } else {
              console.log("匹配失败，不允许保存")
            }

          })
        })
        let newArr = arr.filter(function (item, index) {
          return arr.indexOf(item) === index
        })

        if (newArr == false) {
          this.$message.warning("报账明细中不存在预付款核销明细对应的事前申请单");
          // event();
        } else {
          autoFillIn();
          const isFromPaymentDoc = JSON.parse(localStorage.getItem('isFromPaymentDoc'));
          if (isFromPaymentDoc && !validateMoney()) return;
          // doPaymentDoc();
          event();

        }
      } catch (e) {
        if (e.message !== "LoopInterrupt") {
          throw e
        }
      }
    }
    // }
  } else {
    this.$message.warning('请先点击保存！');
    return;
  }

}
//报账金额
let headAmountSource = this.formModels["MK_COMMON_EXPENSE#REIMBURSEMENT_AMOUNT"].split('|')[1] || 0;
let headAmount = Number(headAmountSource).toFixed(2);

//预计支付金额
const headPayAmountSource = this.formModels["MK_COMMON_EXPENSE#ACTUAL_PAYMENT_AMOUNT"].split('|')[1] || 0;
const headPayAmount = Number(headPayAmountSource).toFixed(2);

const tableDatapayAmount = this.getFormTable("64cshy3yptk0").tableData; //计划付款行
const invoice = this.getFormTable("1p3lp9462gcg").tableData; //报账单明细行

let invoiceAmount = 0;
let invoiceAmountSum = 0; //发票总金额
invoice.forEach(item => {
  if (item.INVOICE_TOTAL == "") {
    // 报账含税金额
    let ORIGINAL_CURRENCY_SOURCE = item.ORIGINAL_CURRENCY.split('|')[1] || 0
    let ORIGINAL_CURRENCY = Number(ORIGINAL_CURRENCY_SOURCE).toFixed(2);
    headAmount = this.$mathArithmetic.subtract(headAmount, ORIGINAL_CURRENCY);
  } else {
    let invoiceAmountSource = item.INVOICE_TOTAL.split('|')[1] || 0;
    invoiceAmount = Number(invoiceAmountSource).toFixed(2);
    invoiceAmountSum = this.$mathArithmetic.add(invoiceAmount, invoiceAmountSum);
  }

})
let payAmount = 0;
let payAmountSum = 0; //计划支付总金额
tableDatapayAmount.forEach(item => {
  let payAmountSource = item.PAY_AMOUNT.split('|')[1] || 0;
  payAmount = Number(payAmountSource).toFixed(2);
  payAmountSum = this.$mathArithmetic.add(payAmount, payAmountSum);
})
if (invoiceAmountSum == 0) {
  if (Number(payAmountSum) != Number(headPayAmount)) {
    this.$message.warning("金额填写有误：计划付款行支付金额总和必须等于预计支付金额，请重新输入！")
    return;
  } else {
    // 校验预算归属归属是否分摊完
    validate();
  }
} else {
  if (Number(headAmount) > Number(invoiceAmountSum)) {
    this.$message.warning("金额填写有误：报销金额不可大于发票金额，请重新输入！")
    return;
  } else if (Number(payAmountSum) != Number(headPayAmount)) {
    this.$message.warning("金额填写有误：计划付款行支付金额总和必须等于预计支付金额，请重新输入！")
    return;
  } else {
    // 校验预算归属归属是否分摊完
    validate();
  }
}