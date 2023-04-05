/* eslint-disable @typescript-eslint/no-explicit-any */

type Constructor<T, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

type InstanceType<T extends new (...arguments_: any) => any> = T extends new (
  ...arguments_: any
) => infer R
  ? R
  : any;

const errors = {
  noInstance: () => new Error("Invalid resolver"),
};

type AsyncHandler<Resolver extends Constructor<InstanceType<Resolver>>> = (
  instance: InstanceType<Resolver>
) => Promise<boolean>;

export function hemera<
  Enum extends string,
  Resolver extends Constructor<InstanceType<Resolver>>
>(
  ...resolvers: [Enum, Resolver][]
): (handler: Enum | AsyncHandler<Resolver>) => Promise<InstanceType<Resolver>> {
  return async function (handler: Enum | AsyncHandler<Resolver>) {
    const instanceMap = new Map<Enum, InstanceType<Resolver>>();

    for (const [type, resolver] of new Map(resolvers)) {
      const instance = new resolver();
      instanceMap.set(type, instance);
    }

    function getSafeInstance(handler: Enum) {
      const instance = instanceMap.get(handler);

      if (!instance) {
        throw errors.noInstance();
      }

      return instance;
    }

    if (typeof handler === "string") {
      return getSafeInstance(handler);
    }

    for (const [_, instance] of instanceMap) {
      if (!instance) {
        throw errors.noInstance();
      }

      const result = await handler(instance);

      if (result) {
        return instance;
      }
    }

    return getSafeInstance("DEFAULT" as Enum);
  };
}
