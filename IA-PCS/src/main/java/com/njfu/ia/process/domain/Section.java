package com.njfu.ia.process.domain;

/**
 * 区块
 */
public class Section {

    /**
     * 区块编号
     */
    private Integer id;

    /**
     * 区块名称
     */
    private String sectionName;

    /**
     * 所属地块编号
     */
    private Integer blockId;

    public Section() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public Integer getBlockId() {
        return blockId;
    }

    public void setBlockId(Integer blockId) {
        this.blockId = blockId;
    }

    @Override
    public String toString() {
        return "Section{" +
                "id=" + id +
                ", sectionName='" + sectionName + '\'' +
                ", blockId=" + blockId +
                '}';
    }
}
