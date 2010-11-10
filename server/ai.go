package ai

type Ai struct {
	X, Y int
	Name string
}

func (a *Ai) Foo() string {
	return "hello"
}
