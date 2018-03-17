package com.njfu.ia.listener.domain;

import java.util.Date;

/**
 * 上行报文
 */
public class UploadRet {

    /**
     * 侦听数据获取时间
     */
    private Date receiveTime;

    /**
     * 数据内容
     */
    private String data;

    public UploadRet(Date receiveTime, String data) {
        this.receiveTime = receiveTime;
        this.data = data;
    }

    public Date getReceiveTime() {
        return receiveTime;
    }

    public void setReceiveTime(Date receiveTime) {
        this.receiveTime = receiveTime;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
