devices hold midi ins and outs
views hold controls that are registered to device controls
HardwareCtrls hold info about which device midi i/o index they are tied to as well as there assigned s, d1, and d2


logger.debug
have a debug switch in the user preferences


DeviceSet


NotInput needs to be part of each midi input, and we need access to it to tell it whether to consume events or not.