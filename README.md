# Weapon DPS Statistical Simulator

This project is an ambitious attempt to create an accurate damage calculator for
the video game Warframe. While other [similar calculators](https://overframe.gg)
exist, I feel they are strongly lacking in a series of primary features I
appreciate:

- They have bugs that hinder simple computations, or otherwise don't implement
  simple features that are useful (e.g. Cascadia Flare);
- They don't simulate status effects, making the computed results extremely
  biased;
- They do not simulate different environments that are more realistic, opting to
  simplify the computation whenever needed in favor of a quick (but more
  worthless) user experience.

This project aims to solve all of these issues while providing a (code-first!)
implementation. It's heavily inspired by other damage calculators like
[PoePoe](https://poepoe.org/warframe/calc/#schema=20240619&compressed=gzip&data=H4sIAAAAAAAAA61UTW%2FaQBD9L3t2u4mi5sCNAImiAEGCpAcUVcN6DCPWu%2B5%2B8CHEf%2B%2BszVel9tCGi7WeGb9573l2dmIWSedetKY7EWAuWjeZyNErR1Uga0RLiEysEap03olo6GfEIZTIGdm3IXr5vc56%2BeTIIDr5ElfQJ7WQY1TW5OAIvRzGpW1S9YlBS5sziIla7%2BsX5rAT1uVkQDd0tlXqwimu%2FlPjt2rugMnKAX8tR%2BSD1bK3qdCFA6mOo9BZgFHIJQ84J2PQNRWM6cAsRev2Zp%2F9b7OmyyM5fA7oIDnmxyOuuCL6OABXNCquh32waeSoxPxsVhdKmCezrtKkG0En%2BvVo5Ogucb9dAfZZYW%2BFJjTxS%2FS7Tztz%2FrUnT644OCcJI0vemr%2Bq%2BMgEbkjH%2BnJ8ZooeEMouBw534dIoAU6BYZh%2F6dCxvsRAqmfqwXRevhYFGk8rPN37bePcq3khrS9%2BPLd0XMcLZZquf%2Fb7gyVrqyAZQQUxMpdNxZp89WUBPqDIbj%2B4xtb7qfYlemxr3cUCog5HhqIVXMRMLHnlpKKZNdE3hCaNyu7kx6D9NOxNnjtMrs63SxtN4CX49X6%2FT%2BazE0cSO4EGy206sI2BI0dTEp6Xj7znTK638h0ZSfYpBI3dqJZjQzw37RUESHtP4wp5wdV62frSugHTpkpzGx6qQ2wcZ8GBanYw72TyvQ2VaQ4K0J51kR8HRD2CsDjE2Fa%2FpqAWSXxiCzON7zQnDSbgQyyKkymVw7e7%2Bw5odf72QuqUlavI01OmQUrv%2B%2F0vF%2FI2%2FSoGAAA%3D)
and
[Warframe-Damage](https://warframe-damage.com/en/?p=eyJ3IjoiTGV4IFByaW1lIiwiZSI6IkNvcnJ1cHRlZCBMYW5jZXIiLCJsIjoiMSIsInNwIjoxLCJleCI6MCwibSI6eyIwIjowLCIxIjowLCIyIjowLCIzIjowLCI0IjowLCI1IjowLCI2IjowLCI3IjowLCI4IjowLCI5IjowLCIxMCI6MCwiMTEiOjAsIjEyIjowLCIxMyI6MCwiMTQiOjAsIjE1IjowLCIxNiI6MCwiMTciOjAsIjE4Ijp7Im1JZCI6IjE4IiwicElkIjowfSwiMTkiOjAsIjIwIjowLCIyMSI6MCwiMjIiOjAsIjIzIjowLCIyNCI6MCwiMjUiOjAsIjI2IjowfSwibyI6eyJocyI6ZmFsc2UsInMiOmZhbHNlLCJtIjp0cnVlLCJoIjpmYWxzZSwibWQiOmZhbHNlLCJ2Ijp7ImlzX3NldCI6ZmFsc2UsInN0dWNrcyI6MH0sInIiOnsiaXNfc2V0IjpmYWxzZSwidmFsIjowfSwieiI6eyJpc19zZXQiOmZhbHNlLCJ2YWwiOjB9LCJ4Ijp7ImlzX3NldCI6ZmFsc2UsInZhbCI6MH0sIm4iOnsiaXNfc2V0IjpmYWxzZSwidmFsIjowfSwiaiI6eyJpc19zZXQiOmZhbHNlLCJ2YWwiOjB9LCJkIjp7ImlzX3NldCI6ZmFsc2UsInZhbCI6MH0sIm1zIjp7ImlzX3NldCI6ZmFsc2UsInZhbCI6MH0sImciOnsiaXNfc2V0IjpmYWxzZX0sInQiOjF9LCJyIjp7fX0%3D)
as well.

Credit to [@AndrewJones-PSU](https://github.com/AndrewJones-PSU) for the
wonderful front-end.

# Project To-Dos

## Web UI

- Break up `page.tsx` to multiple files - Way too long!

## Features

- Add in status effect handling (and simulation!)
- Add enemies and armor/health scaling for enemies
- Add mods
- Add arcanes
- Add incarnons
- Add other weapons (secondaries, melee)
- Separate graphing for "true damage" vs "attenuated damage", or maybe even some
  other outputs? "Unmodified damage"?

# License TL;DR

This project is distributed under the MIT license. This is a paraphrasing of a
[short summary](https://tldrlegal.com/license/mit-license).

This license is a short, permissive software license. Basically, you can do
whatever you want with this software, as long as you include the original
copyright and license notice in any copy of this software/source.

## What you CAN do:

- You may commercially use this project in any way, and profit off it or the
  code included in any way;
- You may modify or make changes to this project in any way;
- You may distribute this project, the compiled code, or its source in any way;
- You may incorporate this work into something that has a more restrictive
  license in any way;
- And you may use the work for private use.

## What you CANNOT do:

- You may not hold me (the author) liable for anything that happens to this code
  as well as anything that this code accomplishes. The work is provided as-is.

## What you MUST do:

- You must include the copyright notice in all copies or substantial uses of the
  work;
- You must include the license notice in all copies or substantial uses of the
  work.

If you're feeling generous, give credit to me somewhere in your projects.
