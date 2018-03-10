package com.njfu.ia.sys.mapper;

import com.njfu.ia.sys.domain.Employee;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class EmployeeMapperTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeMapperTest.class);

    @Resource
    private EmployeeMapper employeeMapper;

    @Test
    public void selectEmployees() throws Exception {
        List<Employee> employees = employeeMapper.selectEmployees(new Employee());
        LOGGER.info("employees: {}", employees);
    }

    @Test
    public void insertEmployee() throws Exception {
        Employee employee = new Employee();
        employee.setEmpId("e000");
        employee.setEmpName("test");
        employee.setEmpTel("test");
        employee.setEmpPosition("test");
        employee.setEmpAge(0);
        employee.setEmpSex("男");
        employee.setEmpPs("test");

        int res = employeeMapper.insertEmployee(employee);

        Assert.assertEquals(1, res);
    }

    @Test
    public void updateEmployee() throws Exception {
        Employee employee = new Employee();
        employee.setEmpId("e001");
        employee.setEmpName("test");
        employee.setEmpTel("test");
        employee.setEmpPosition("test");
        employee.setEmpAge(0);
        employee.setEmpSex("男");
        employee.setEmpPs("test");

        int res = employeeMapper.updateEmployee(employee);

        Assert.assertEquals(1, res);
    }

    @Test
    public void deleteEmployee() throws Exception {
        Employee employee = new Employee();
        employee.setEmpId("e001");

        int res = employeeMapper.deleteEmployee(employee);

        Assert.assertEquals(1, res);
    }

}