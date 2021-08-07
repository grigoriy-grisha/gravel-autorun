class ObservableValue {
  constructor(private value: any) {}

  set(value) {
    this.value = value;
  }

  get() {
    return this.value;
  }
}

export function observableValue(value: any) {
  return new ObservableValue(value);
}
