export class UnknownSpeciesError extends Error {
  constructor(message = "Неизвестный вид") {
    super(message);
    this.name = "UnknownSpeciesError";
  }
}
