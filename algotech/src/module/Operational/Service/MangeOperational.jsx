import api from "../../Hooks/ApiConfig";

class ManageOperational {
  constructor(
    user_id = null,
    search_term = null,
    current_page = null,
    rows_per_page = null,
    page_number = null,
    order_by = null,
    filter_value = null,
  ) {
    this.user_id = user_id;
    this.search_term = search_term;
    this.current_page = current_page;
    this.rows_per_page = rows_per_page;
    this.page_number = page_number;
    this.order_by = order_by;
    this.filter_value = filter_value;
  }
}
