package cluster

import (
	"k8s.io/apimachinery/pkg/types"

	"github.com/tilt-dev/tilt/internal/k8s"
	"github.com/tilt-dev/tilt/pkg/apis/core/v1alpha1"
)

type FakeClientCache struct {
	*ConnectionManager
}

var _ ClientCache = &FakeClientCache{}

// NewFakeClientCache creates a client cache suitable for tests.
//
// If defaultClient is not nil, it will be immediately available for the "default" Cluster connection.
// It's possible to store additional clients for other Cluster connections as well.
func NewFakeClientCache(defaultClient k8s.Client) *FakeClientCache {
	cm := NewConnectionManager()
	if defaultClient != nil {
		defaultNN := types.NamespacedName{Name: v1alpha1.ClusterNameDefault}
		cm.store(defaultNN, connection{connType: connectionTypeK8s, k8sClient: defaultClient})
	}

	return &FakeClientCache{
		ConnectionManager: cm,
	}
}

// AddK8sClient adds the client if there is currently no client/error for the cluster key.
func (f *FakeClientCache) AddK8sClient(key types.NamespacedName, client k8s.Client) {
	f.connections.LoadOrStore(key, connection{connType: connectionTypeK8s, k8sClient: client})
}

// SetK8sClient sets a client for the cluster key, overwriting any that exists.
func (f *FakeClientCache) SetK8sClient(key types.NamespacedName, client k8s.Client) {
	f.store(key, connection{connType: connectionTypeK8s, k8sClient: client})
}

// SetClusterError sets an error for the cluster key.
func (f *FakeClientCache) SetClusterError(key types.NamespacedName, err error) {
	errString := ""
	if err != nil {
		errString = err.Error()
	}
	f.store(key, connection{connType: connectionTypeK8s, error: errString})
}
