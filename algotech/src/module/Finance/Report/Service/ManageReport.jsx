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
    has_report = false,
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

  async postPayment(data, token) {
    try {
      const response = await api.post("/payment", data, {
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

  async getProcessPayments() {
    /// utilizado para carregamento de pagamentos
    try {
      const response = await api.get("/payment", {
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

  async getImports() {
    try {
      const response = await api.get("/reportfinance/list-import", {
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

  async deleteImports(name, token) {
    try {
      const response = await api.delete(
        `/reportfinance/delete-imports/${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: this.user_id,
          },
        },
      );
      if (response.data.error) {
        throw new Error(response.data.message_id);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deletePayments(data, token) {
    try {
      const response = await api.delete(`/payment`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: this.user_id,
        },
        data: data,
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
      const response = await api.post("/flags", data, {
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
      const response = await api.get("/flags", {
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

  async getAllReportProposal() {
    try {
      const response = await api.get("/payment/proposal", {
        params: {
          current_page: this.current_page,
          rows_per_page: this.rows_per_page,
          filter_by: this.search_term,
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
      const response = await api.delete("/flags", {
        headers: {
          Authorization: `Bearer ${token}`,
          id: this.user_id,
        },
        data: data,
      });

      if (response.data.error) {
        throw new Error(response.data.message_id);
      }

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async importReport(data, token) {
    try {
      const response = await api.post("/reportfinance/import-reports", data, {
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

  async getAllReportProposals() {
    try {
      const response = await api.get(
        "/reportfinance/export-report?file=csv",
        {},
      );
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
