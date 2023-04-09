type Constructor<T = any> = new (...rest: any[]) => T;

type Getter<T> = () => T;

type TypeOf<Type> = Type extends { type: infer T }
  ? T extends string
    ? T
    : never
  : never;

type BaseOf<Type> = Type extends { base: infer T }
  ? T extends Constructor
    ? T
    : never
  : never;

const errors = {
  noInstance: () => new Error("Invalid resolver"),
};

class Hemera<
  Type extends string,
  Instance,
  TypeGetter extends [Type, Getter<Instance>]
> {
  private resolvers: Map<Type, Getter<Instance>>;

  constructor(...resolvers: TypeGetter[]) {
    this.resolvers = new Map(resolvers);
  }

  public get(type: Type) {
    const getter = this.resolvers.get(type);

    if (!getter) {
      throw errors.noInstance();
    }

    return getter();
  }

  public async resolve(resolver: (instance: Instance) => Promise<boolean>) {
    for (const [type] of this.resolvers) {
      const instance = this.get(type);

      const result = await resolver(instance);

      if (result) {
        return instance;
      }
    }

    throw errors.noInstance();
  }
}

export default function hemera<
  Class extends Constructor<InstanceType<Class>> & { type: string; base: any },
  Type extends TypeOf<Class>,
  Base extends BaseOf<Class>,
  TypeGetter extends [Type, Getter<InstanceType<Base>>]
>(...resolvers: Class[]) {
  const mapped = resolvers.map((clazz) => [
    clazz.type,
    () => new clazz() as Getter<InstanceType<Base>>,
  ]) as TypeGetter[];

  return new Hemera<Type, InstanceType<Base>, TypeGetter>(...mapped);
}
