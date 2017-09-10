$("#sensorFileTable").bootstrapTable({
    url: 'sys/file/getSensors',
    queryParams: function (params) {
        return {
            offset: params.offset,
            limit: params.limit,
            sensorId: $('#querySensorId').val().trim(),
            sensorFunc: $('#querySensorFunc').val(),
            sensorType: $('#querySensorType').val().trim(),
            fieldId: $('#queryFieldId').val(),
            useStatus: $('#queryUseStatus').val()
        }
    },
    columns: [{
        field: 'sensorId',
        title: '传感器编号'
    }, {
        formatter: function (value, row, index) {
            var sensorFunc = row.sensorFunc;
            var format = '';
            if (sensorFunc === '1') {
                format = '温度传感器'
            } else if (sensorFunc === '2') {
                format = '湿度传感器'
            }
            return format;
        },
        title: '传感器功能类型'
    }, {
        field: 'sensorType',
        title: '传感器型号'
    }, {
        field: 'field.fieldId',
        title: '传感器所属大棚'
    }, {
        formatter: function (value, row, index) {
            var useStatus = row.useStatus;
            var format = '故障中';
            if (useStatus === '1') {
                format = '使用中'
            } else if (useStatus === '0') {
                format = '未使用'
            }
            return format;
        },
        title: '使用状态'
    }, {
        field: 'sensorPs',
        title: '传感器备注'
    }, {
        formatter: function (value, row, index) {
            return [
                '<a href="javascript:modifySensor(' + "'" + row.sensorId + "', '" + row.sensorFunc+ "', '"
                + row.sensorType + "', '" + convertFieldId(row.field) + "', '" + row.useStatus + "', '"
                + convertNull(row.sensorPs) + "'" + ')">' +
                '<i class="glyphicon glyphicon-pencil"></i>修改' +
                '</a>',
                '<a href="javascript:removeSensor(' + "'" + row.sensorId + "'" + ')">' +
                '<i class="glyphicon glyphicon-remove"></i>删除' +
                '</a>'
            ].join('');
        },
        title: '操作'
    }],
    striped: true,
    pagination: true,
    sidePagination: 'server',
    pageSize: 10,
    pageList: [5, 10, 25, 50]
});

// 处理json中field可能出现的null值
function convertFieldId(field) {
    try {
        return field.fieldId;
    } catch (err) {
        return '';
    }
}

// 处理json中可能出现的null值
function convertNull(param) {
    if (null === param) {
        return '';
    } else {
        return param;
    }
}

// 重置
$('#resetBtn').click(function () {
    $('#queryToolBar :text').val('');
    $('#queryToolBar .selectpicker').selectpicker('val', '');
    $("#sensorFileTable").bootstrapTable('selectPage', 1);
});

// 查询
$('#queryBtn').click(function () {
    $("#sensorFileTable").bootstrapTable('selectPage', 1);
});

// 设置bootstrap-select大小
$('#queryToolBar .selectpicker').selectpicker({
    width: '180.67px'
});

// 数据提交
function deliverData(path, sensorId, sensorFunc, sensorType, fieldId, useStatus, sensorPs) {
    $.ajax({
        url: path,
        type: 'post',
        data: {
            sensorId: sensorId,
            sensorFunc: sensorFunc,
            sensorType: sensorType,
            fieldId: fieldId,
            useStatus: useStatus,
            sensorPs: sensorPs
        },
        success: function (res) {
            bootbox.alert({
                title: '提示',
                message: res.message
            });
            $("#sensorFileTable").bootstrapTable('selectPage', 1);
        }
    });
}

// 新增
$('#addBtn').click(function () {
    // 清空新增modal内容
    $('.modal :text').val('');
    $('#addSensorPs').val('');
    $('#addModal .selectpicker').each(function () {
        var val = $(this).find('option:first').val();
        $(this).selectpicker('val', val);
    });

    $('#addModal').modal('show');
});

$('#saveAdd').click(function () {
    var sensorId = $('#addSensorId').val().trim();
    var sensorFunc = $('#addSensorFunc').val();
    var sensorType = $('#addSensorType').val().trim();
    var fieldId = $('#addFieldId').val();
    var useStatus = $('#addUseStatus').val();
    var sensorPs = $('#addSensorPs').val().trim();

    $('#addModal').modal('hide');

    if (sensorId === '' || sensorFunc === '' || sensorType === '') {
        bootbox.alert({
            title: '提示',
            message: '请输入完整信息！'
        });
    } else if (sensorPs.length > 80) {
        bootbox.alert({
            title: '提示',
            message: '传感器备注限输入80个字符！'
        });
    } else {
        bootbox.confirm({
            title: '提示',
            message: '确认新增传感器信息',
            callback: function (flag) {
                if (flag) {
                    deliverData('sys/file/addSensor', sensorId, sensorFunc, sensorType, fieldId, useStatus, sensorPs);
                }
            }
        });
    }
});

// 修改
function modifySensor(sensorId, sensorFunc, sensorType, fieldId, useStatus, sensorPs) {
    $('#modifySensorId').text(sensorId);
    $('#modifySensorFunc').selectpicker('val', sensorFunc);
    $('#modifySensorType').val(sensorType);
    $('#modifyFieldId').selectpicker('val', fieldId);
    $('#modifyUseStatus').selectpicker('val', useStatus);
    $('#modifySensorPs').val(sensorPs);

    $('#modifyModal').modal('show');
}

$('#saveModify').click(function () {
    var sensorId = $('#modifySensorId').text();
    var sensorFunc = $('#modifySensorFunc').val();
    var sensorType = $('#modifySensorType').val().trim();
    var fieldId = $('#modifyFieldId').val();
    var useStatus = $('#modifyUseStatus').val();
    var sensorPs = $('#modifySensorPs').val().trim();

    $('#modifyModal').modal('hide');

    if (sensorType === '') {
        bootbox.alert({
            title: '提示',
            message: '请输入完整信息！'
        });
    } else if (sensorPs.length > 80) {
        bootbox.alert({
            title: '提示',
            message: '传感器备注限输入80个字符！'
        });
    } else {
        bootbox.confirm({
            title: '提示',
            message: '确认修改传感器信息',
            callback: function (flag) {
                if (flag) {
                    deliverData('sys/file/modifySensor', sensorId, sensorFunc, sensorType, fieldId, useStatus, sensorPs);
                }
            }
        });
    }
});

// 删除
function removeSensor(sensorId) {
    bootbox.confirm({
        title: '提示',
        message: '确认删除传感器信息',
        callback: function (flag) {
            if (flag) {
                deliverData('sys/file/removeSensor', sensorId);
            }
        }
    });
}