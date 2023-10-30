export default class FetcherService {
  constructor() {
    this.state = {
      loading: false,
      error: null
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  fetch = async (callback, errorCallback) => {
    this.setState({ loading: true });
  
    try {
      await callback()  
    } catch (error) {
      errorCallback(error);
    }
  
    this.setState({ loading: false });
  }
}