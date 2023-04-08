const errors = {
  noInstance: () => new Error("Invalid resolver"),
};

type AsyncResolver<Instance> = (instance: Instance) => Promise<boolean>;

export default class Hemera<Enum extends string, Instance> {
  public instances: Map<Enum, Instance>;

  constructor(...resolvers: [Enum, Instance][]) {
    this.instances = new Map<Enum, Instance>();

    for (const [type, resolver] of new Map(resolvers)) {
      this.instances.set(type, resolver);
    }
  }

  public get(type: Enum): Instance {
    const instance = this.instances.get(type);

    if (!instance) {
      throw errors.noInstance();
    }

    return instance;
  }

  public async resolve(resolver: AsyncResolver<Instance>): Promise<Instance> {
    for (const [type] of this.instances) {
      const instance = this.get(type);

      const result = await resolver(instance);

      if (result) {
        return instance;
      }
    }

    throw errors.noInstance();
  }
}
