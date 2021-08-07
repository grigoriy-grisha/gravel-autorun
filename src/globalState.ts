class GlobalState {
  private executableCallback = null;

  getExecutableCallback() {
    return this.executableCallback;
  }

  setExecutableCallback(callback) {
    this.executableCallback = callback;
  }
}

const globalState = new GlobalState();
export default globalState;
