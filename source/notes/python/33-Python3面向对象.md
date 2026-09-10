---
title: "Python3 面向对象"
tags: [面向对象]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 面向对象

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

用 `class` 把数据（属性）和行为（方法）封装成对象，通过继承复用代码、通过多态让同一接口表现不同行为。

## 要点

- **类（class）** 是模板，**对象/实例** 是按模板造出来的具体个体。
- 实例方法第一个参数是 `self`（代表实例本身），`__init__` 是构造时自动调用的初始化方法。
- **继承**：`class 子类(父类):`，子类自动拥有父类的属性和方法，可重写（override）。
- **`super()`** 调用父类方法，`__init__` 里常用它初始化父类部分。
- **多态**：不同子类实现同名方法，调用方无需关心具体类型，接口一致、行为各异。
- **封装**：`_name` 约定为受保护，`__name`（双下划线）触发名称改写，实现私有。
- **类属性 vs 实例属性**：类属性所有实例共享，实例属性各自独立；别用可变对象做类属性。
- **魔术方法**（dunder）：`__init__`、`__str__`、`__repr__`、`__len__`、`__eq__` 等，让对象支持内置操作。
- `@classmethod` 第一个参数是 `cls`；`@staticmethod` 不接收 self/cls。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `class A:` | 定义类 | `class Dog:` |
| `def __init__(self, x):` | 构造/初始化 | 创建实例时自动调用 |
| `def method(self):` | 实例方法，需 self | `dog.bark()` |
| `class B(A):` | 继承 A | `class Cat(Animal):` |
| `super().__init__()` | 调父类初始化 | 子类构造里调用 |
| `def method(self):` | 重写父类方法 | 同名即覆盖 |
| `obj = A()` | 创建实例 | `d = Dog("旺财")` |
| `isinstance(o, A)` | 判断是否为某类实例 | `isinstance(d, Dog)` |
| `issubclass(B, A)` | 判断子类关系 | `issubclass(Cat, Animal)` |
| `@classmethod` | 类方法，参数 cls | 常用于替代构造器 |
| `@staticmethod` | 静态方法，无 self/cls | 工具函数 |
| `@property` | 把方法当属性访问 | `obj.area` |
| `self._x` | 约定受保护 | 只提示，不强制 |
| `self.__x` | 私有（名称改写） | 外部几乎访问不到 |
| `__str__` | 定义 `print`/`str()` 输出 | 返回字符串 |
| `__repr__` | 定义调试表示 | 返回字符串 |
| `__len__` | 支持 `len(obj)` | 返回整数 |
| `__eq__` | 定义 `==` 行为 | 返回 bool |

## 代码示例

```python
class Animal:
    kind = "动物"            # 类属性，所有实例共享

    def __init__(self, name):
        self.name = name     # 实例属性，各自独立

    def speak(self):
        return "..."

    def __str__(self):
        return f"{self.kind}:{self.name}"


class Dog(Animal):
    def __init__(self, name, age):
        super().__init__(name)   # 初始化父类部分
        self.age = age

    def speak(self):             # 重写：多态
        return f"{self.name} 汪汪"


class Cat(Animal):
    def speak(self):
        return f"{self.name} 喵喵"


# 多态：同一接口，不同行为
for a in (Dog("旺财", 3), Cat("咪咪")):
    print(a.speak())             # 汪汪 / 喵喵

print(Dog("旺财", 3))            # 调用 __str__ → 动物:旺财


# 封装 + @property
class Circle:
    def __init__(self, r):
        self._r = r

    @property
    def area(self):              # 当属性用: c.area
        return 3.14159 * self._r ** 2

    @property
    def r(self):
        return self._r

    @r.setter                    # 赋值时校验: c.r = 5
    def r(self, value):
        if value <= 0:
            raise ValueError("半径必须为正")
        self._r = value


c = Circle(2)
print(c.area)                    # 12.56636（无需括号）
c.r = 3                          # 走 setter
print(c.area)


# 私有属性：名称改写后是 _类名__属性
class Bank:
    def __init__(self):
        self.__balance = 0       # 私有
    def deposit(self, amt):
        self.__balance += amt
    def get_balance(self):
        return self.__balance

b = Bank()
b.deposit(100)
print(b.get_balance())           # 100
# print(b.__balance)             # 报错，外部访问不到
```

## 易错点

- **`self` 忘写**：实例方法第一个参数必须是 `self`，否则调用时参数错位。
- **可变类属性**：`class A: items = []` 所有实例共享，会串数据，改到 `__init__` 里创建。
- **`__x` 不是真私有**：只是重命名为 `_类名__x`，仍可 `obj._A__x` 访问，靠约定自觉。
- **`super()` 漏调**：子类重写 `__init__` 却不调父类 `__init__`，父类属性就不存在。
- **`__str__` 必须返回字符串**，返回非字符串会报 `TypeError`。
- **`isinstance` vs `type`**：`isinstance` 支持继承链，`type(o) == A` 不考虑子类，判断类型推荐前者。
- **`@property` 和同名 setter 名字必须一致**，否则赋值不会走校验。
