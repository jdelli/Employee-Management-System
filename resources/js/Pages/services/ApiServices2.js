import apiService from "./ApiServices";


const apiService2 = {
    checkIncompletePayroll(employeeId) {
        return apiService.get(`/check-incomplete-payroll/${employeeId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error checking incomplete payroll:', error);
                throw error;
            });
    }
};


export default apiService2;