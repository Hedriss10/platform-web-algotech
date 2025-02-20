import api from "../../../Hooks/ApiConfig";

class ManageReport {
  constructor(
    user_id = null,
    search_term = null,
    current_page = null,
    rows_per_page = null,
    page_number = null,
    order_by = null,
    filter_value = null,
    has_report = null,
  ) {
    this.user_id = user_id;
    this.search_term = search_term;
    this.current_page = current_page;
    this.rows_per_page = rows_per_page;
    this.page_number = page_number;
    this.order_by = order_by;
    this.filter_value = filter_value;
    this.has_report = has_report;
  }

  async getReport() {
    try {
      const response = await api.get("/reportfinance", {
        params: {
          current_page: this.current_page,
          rows_per_page: this.rows_per_page,
          filter_by: this.search_term,
          page_number: this.page_number,
          order_by: this.order_by,
          filter_value: this.filter_value,
        },
      });
      if (response.data.error) {
        throw new Error(response.data.message_id);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async postFlags(data, token) {
    try {
      const response = await api.post("/reportfinance/flags", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: this.user_id,
        },
      });
      if (response.data.error) {
        throw new Error(response.data.message_id);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getFlags() {
    try {
      const response = await api.get("/reportfinance/flags", {
        params: {
          current_page: this.current_page,
          rows_per_page: this.rows_per_page,
          filter_by: this.search_term,
          page_number: this.page_number,
          order_by: this.order_by,
          filter_value: this.filter_value,
        },
      });
      if (response.data.error) {
        throw new Error(response.data.message_id);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllReportSellers() {
    try {
      const response = await api.get("/reportfinance/sellers", {
        params: {
          filter_by: this.search_term,
          current_page: this.current_page,
          rows_per_page: this.rows_per_page,
          page_number: this.page_number,
          order_by: this.order_by,
          filter_value: this.filter_value,
          has_report: this.has_report,
        },
      });
      if (response.data.error) {
        throw new Error(response.data.message_id);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteFlags(data, token) {
    try {
      const response = await api.delete("/reportfinance/flags-delete", {
        headers: {
          Authorization: `Bearer ${token}`,
          id: this.user_id
        },
        data: data
      });
  
      if (response.data.error) {
        throw new Error(response.data.message_id);
      }
  
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }



}

export default ManageReport;
