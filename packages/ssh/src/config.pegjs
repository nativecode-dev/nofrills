Start
  = (Comment / Host / Config / WS? EOL)+ EOF

Comment
  = WS* '#' (!EOL .)* EOL

Host
  = WS* 'Host' WS* Value
  / WS* 'Match' WS* Value

Config
  = WS* Identifier WS* Value
  / WS* AddKeysToAgent WS* AddKeysToAgentValue
  / WS* AddressFamily WS* AddressFamilyValue
  / WS* BatchMode WS* BatchModeValue
  / WS* BindAddress WS* BindAddressValue

IPAddress
  = Octet '.' Octet '.' Octet '.' Octet

Octet
  = [0-9]{1,3}

AddKeysToAgent
  = 'AddKeysToAgent'i

AddKeysToAgentValue
  = 'no'i
  / 'ask'i
  / 'confirm'i
  / 'yes'i

AddressFamily
  = 'AddressFamily'i

AddressFamilyValue
  = 'any'i
  / 'inet'i
  / 'inet6'i

BatchMode
  = 'BatchMode'i

BatchModeValue
  = 'no'i
  / 'yes'i

BindAddress
  = 'BindAddress'i

BindAddressValue
  = IPAddress

Identifier
  = 'CanonicalDomains'i
  / 'CanonicalizeFallbackLocal'i
  / 'CanonicalHostname'i
  / 'CanonicalizeMaxDots'i
  / 'CanonicalizePermittedCNAMEs'i
  / 'CertificateFile'i
  / 'ChallengeResponseAuthentication'i
  / 'CheckHostIP'i
  / 'Cipher'i
  / 'Ciphers'i
  / 'ClearAllForwardings'i
  / 'Compression'i
  / 'CompressionLevel'i
  / 'ConnectionAttempts'i
  / 'ConnectTimeout'i
  / 'ControlMaster'i
  / 'ControlPath'i
  / 'ControlPersist'i
  / 'DynamicForward'i
  / 'EnableSSHKeysign'i
  / 'EscapeChar'i
  / 'ExitOnForwardFailure'i
  / 'FingerprintHash'i
  / 'ForwardAgent'i
  / 'ForwardX11'i
  / 'ForwardX11Timeout'i
  / 'ForwardX11Trusted'i
  / 'GatewayPorts'i
  / 'GlobalKnownHostsFile'i
  / 'GSSAPIAuthentication'i
  / 'GSSAPIDelegateCredentials'i
  / 'HashKnownHosts'i
  / 'HostbasedAuthentication'i
  / 'HostbasedKeyTypes'i
  / 'HostKeyAlgorithms'i
  / 'HostKeyAlias'i
  / 'HostName'i
  / 'IdentitiesOnly'i
  / 'IdentityAgent'i
  / 'IdentityFile'i
  / 'IgnoreUnknown'i
  / 'Include'i
  / 'IPQoS'i
  / 'KbdInteractiveAuthentication'i
  / 'KbdInteractiveDevices'i
  / 'KexAlgorithms'i
  / 'LocalCommand'i
  / 'LocalForward'i
  / 'LogLevel'i
  / 'MACs'i
  / 'NoHostAuthenticationForLocalhost'i
  / 'NumberOfPasswordPrompts'i
  / 'PasswordAuthentication'i
  / 'PermitLocalCommand'i
  / 'PKCS11Provider'i
  / 'Port'i
  / 'PreferredAuthentications'i
  / 'Protocol'i
  / 'ProxyCommand'i
  / 'ProxyJump'i
  / 'ProxyUseFdpass'i
  / 'PubkeyAcceptedKeyTypes'i
  / 'PubkeyAuthentication'i
  / 'RekeyLimit'i
  / 'RemoteForward'i
  / 'RequestTTY'i
  / 'RevokedHostKeys'i
  / 'RhostsRSAAuthentication'i
  / 'RSAAuthentication'i
  / 'SendEnv'i
  / 'ServerAliveCountMax'i
  / 'ServerAliveInterval'i
  / 'StreamLocalBindMask'i
  / 'StreamLocalBindUnlink'i
  / 'StrictHostKeyChecking'i
  / 'TCPKeepAlive'i
  / 'Tunnel'i
  / 'TunnelDevice'i
  / 'UpdateHostKeys'i
  / 'UsePrivilegedPort'i
  / 'User'i
  / 'UserKnownHostsFile'i
  / 'VerifyHostKeyDNS'i
  / 'VersionAddendum'i
  / 'VisualHostKey'i
  / 'XAuthLocation'i


Value
  = (!EOL .)*

EOL
  = '\r\n'
  / '\r'
  / '\n'

EOF
  = !.

WS
  = ' '
