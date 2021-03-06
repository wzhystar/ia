/**
 * 初始化记录事件
 */
var initMemo = {
    init: function () {
        /**
         * 初始加载日志
         */
        initMemo.initMemoList(0);

        /**
         * 激活侧边栏
         */
        $('[data-target="#memo-man"]').trigger('click').parent().find('li:eq(0) a').addClass('side-active');

        /**
         * 切换记录类型事件
         */
        $('.memo-type-list li').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            var type = $(this).attr('type');
            initMemo.initMemoList(type);
        });
    },
    /**
     * 加载记录列表
     * @param type 0-日志 1-备忘录 2-注意事项
     */
    initMemoList: function (type) {
        var $list = $('.log-list');
        $list.empty();
        var html = '<li title="记录列表" id="add-memo" mid="0">记录列表<i class="fa fa-plus pull-right"></i></li>';
        $.ajax({
            url: 'sys/memo/list',
            data: {
                type: type
            },
            success: function (res) {
                if (res.code == 201) {
                    $.each(res.data, function (i, el) {
                        var id = el.id;
                        var title = el.title;
                        html += '<li mid="' + id + '" title="' + title + '">' + title + '</li>';
                    });
                    $list.append(html);
                    initMemo.initMemoContent();
                }
            }
        })
    },
    /**
     * 初始化记录内容
     */
    initMemoContent: function () {
        initMemo.fillMemoArea('0', '', '', '', '');

        $('.log-list li').click(function () {
            var mid = $(this).attr('mid');
            if ('0' == mid) {
                initMemo.fillMemoArea(mid, '', '', '');
            } else {
                $.ajax({
                    url: 'sys/memo/data',
                    data: {
                        id: mid
                    },
                    success: function (res) {
                        if (res.code == 201) {
                            var data = res.data;
                            /** @namespace data.updateUser */
                            /** @namespace data.updateTime */
                            initMemo.fillMemoArea(mid, data.title, data.content, data.updateUser, data.updateTime);
                        }
                    }
                });
            }
        });
    },
    /**
     * 填充内容区域
     * @param mid
     * @param title
     * @param content
     * @param updateUser
     * @param updateTime
     */
    fillMemoArea: function (mid, title, content, updateUser, updateTime) {
        var editInfo = '';
        if (updateUser && updateUser.length > 0 && updateTime && updateTime.length > 0) {
            editInfo = '<div>由 <span class="status-data">' + updateUser + '</span>&nbsp; 最后更新于：<span class="status-data">'
                + updateTime + '</span></div>';
        }
        var html = '<div class="form-inline form-group"><label for="memo-title">标题：</label>' +
            '<input type="text" id="memo-title" class="form-control" value="' + title + '" mid="' + mid + '"></div>' +
            editInfo +
            '<textarea class="memo-edit-area">' + content + '</textarea><div class="pull-right">' +
            '<button class="btn btn-danger" id="btn-del">删除</button>&nbsp;<button class="btn btn-success" id="btn-save">' +
            '保存</button></div>';
        $('.memo-edit-div').empty().append(html);
        // 绑定事件
        $('#btn-save').click(function () {
            initMemo.saveMemo();
        });
        $('#btn-del').click(function () {
            initMemo.removeMemo();
        });
    },
    /**
     * 发送请求
     * @param url
     * @param mid
     * @param title
     * @param type
     * @param content
     */
    sendRequest: function (url, mid, title, type, content) {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                id: mid,
                title: title,
                type: type,
                content: content
            },
            success: function (res) {
                var message = '操作失败';
                if (res.success) {
                    message = "操作成功！";
                }
                bootbox.alert({
                    title: '提示',
                    message: message
                });
                initMemo.initMemoList(type);
            }
        });
    },
    /**
     * 获取记录类型
     * @returns String
     */
    getType: function () {
        var type;
        $('.memo-type-list li').each(function (i, el) {
            if ($(this).hasClass('active')) {
                type = el.type;
            }
        });
        return type;
    },
    /**
     * 保存记录
     */
    saveMemo: function () {
        var mid = $('#memo-title').attr('mid');
        var title = $('#memo-title').val().trim();
        var content = $('.memo-edit-area').val().trim();
        var type = initMemo.getType();
        if (title == undefined || content == undefined || title.length == 0 || content.length == 0) {
            bootbox.alert({
                title: '提示',
                message: '标题和内容不可为空！'
            });
        } else {
            if (type !== undefined) {
                if (mid !== '0') {
                    bootbox.confirm({
                        title: '提示',
                        message: '确认修改记录',
                        callback: function (flag) {
                            if (flag) {
                                initMemo.sendRequest('sys/memo/modify', mid, title, type, content);
                            }
                        }
                    });
                } else {
                    bootbox.confirm({
                        title: '提示',
                        message: '确认新增记录'
                    }, callback(function (flag) {
                        if (flag) {
                            initMemo.sendRequest('sys/memo/add', mid, title, type, content);
                        }
                    }));
                }
            }
        }
    }
    ,
    /**
     * 删除记录
     */
    removeMemo: function () {
        var mid = $('#memo-title').attr('mid');
        var type = initMemo.getType();
        if (mid == '0') {
            bootbox.alert({
                title: '提示',
                message: '不可删除！'
            });
        } else {
            bootbox.confirm({
                title: '提示',
                message: '确认删除记录',
                callback: function (res) {
                    if (res) {
                        initMemo.sendRequest('sys/memo/remove', mid, null, type);
                    }
                }
            });
        }
    },
    vm: new Vue({
        el: '#wrapper',
        mounted: function () {
            this.$nextTick(function () {
                initMemo.init();
            });
        }
    })
};